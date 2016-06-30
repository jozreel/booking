var cfg = require('../config/config');
var pt = require('path');
var world = require('world');
var ajsloadable = function()
{
	this.viewpth = cfg.viewpath;
	this.html = "";
	//console.log(this.html);
}



ajsloadable.prototype.view=function(view, args, resp,req,cache,replacespecial,customui)
{
	
	
	//resp.writeHead(200, {'Content-Type':'text/html'});
	//var res = 'hello';
	var fs = require('fs');
	var obj = this;
	//this.findbyconvention(view);
	/*var path ='';
	var path1 = cfg.viewpath + '/shared/'+view+'.html';
	var path2 = cfg.viewpath +'/'+req.caller+'/'+view+'.html';
	path1 = pt.normalize(path1);
	path2 = pt.normalize(path2);
	
	if(this.findbyconvention(path1))
	   path = path1;
	if(this.findbyconvention(path2))
	   path = path2;
	
	*/
	var path = req.viewpath(view);
	if(path !== '')
	{
	//cache file depending on weather values stored in dbase is different from values in file ... todo
	if(cache == true)
	{
		   
	if(resp.cache !== undefined && !resp.cache.cacheFile(path,true))
	{
	
	//console.log(path);
	// console.log('lp');
	 fs.readFile(path, function(err, data)
		 {
			 console.log('lp');
			 var vals = args;
			 var dt = data.toString();
			// console.log(dt);
			 var shtml = require('simple').shtml;
			 shtml.clearHead();
			 shtml.req = req;
			// dt =shtml.parse(dt);
			  shtml.setViewHolder(vals);
			  dt =shtml.inline(dt);
			  dt =shtml.block(dt);
			 //var pt= '/\{{(\w+)\}}/';
			var ui=  obj.parse(vals,dt)
			
			if(replacespecial ===true)
			 if(resp.urlencode !== undefined)
			     ui = resp.urlencode.addspecial(ui);
			  ui =  obj.insertContent(vals,ui,customui)	
			  ui=shtml.updatepageheader(ui);
			 obj.output(resp,ui,path);
			 //console.log(resp);
		
		
		 }
		 ); 
		  	 
			 
			  
	}
	}
	else
	{    
		
		 fs.readFile(path, function(err, data)
		 {
			 //prevent from breaking if file not found
			
			 var vals = args;
			 var dt = data.toString();
			 var shtml = require('simple').shtml;
			  shtml.clearHead();
			  shtml.req = req;
			// dt =shtml.parse(dt);
			 shtml.setViewHolder(vals);
			 dt =shtml.inline(dt);
			 dt =shtml.block(dt);
			
			 //var pt= '/\{{(\w+)\}}/';
			var ui=  obj.parse(vals,dt)
			if(replacespecial ===true)
			{
			 if(resp.urlencode !== undefined)
			 {
				 
			     ui = resp.urlencode.addspecial(ui);
				
			 }
			}
			 ui =  obj.insertContent(vals,ui,customui)
			 ui= shtml.updatepageheader(ui);
			 obj.output(resp,ui,path);
			 //console.log(resp);
		
		
		 }
		 ); 
	}
	}
	else
	{
		//resp.writeHead(404, {'Content-Type':'text/html'});
	    resp.end("404 : content not found");
	}		  
			
		//return res;	
}



ajsloadable.prototype.parse = function(vals, dt)
{
	var i=0;
	var ui= dt.replace(/\{{(\w+)\}}/g, function(x){
		        i++;
				 var key = x.slice(2,-2);
				// console.log(vals);
				 //console.log(key);
				 if(vals[key])
				 { 
				   return vals[key];
				 }
				 else
				 {
					 return '';
				 }
				 
			 });
			 if(ui !== undefined)
	          {
	          if(i!==0 )
	              ui = this.parse(vals,ui);
				  return ui;
			  }
			  else
			     return "";
			 
	  
            
	  
	 
         // return ui;
			 
}

ajsloadable.prototype.insertContent = function(vals,content,customui)
{
	
	var i=0;
	var fs = require('fs');
	var obj =this;
	var pt =  '';
	if(customui !== undefined)
	   pt=customui;
	 else
	   pt = cfg.viewlayout;
	var path = cfg.viewpath+"/shared/"+pt+'.html';
	
	        try
		     {
			  var data = fs.readFileSync(path);
			   var dt = data.toString();
			   var ui = obj.parse(vals,dt)
	            ui= ui.replace(/\$generateContent\(\);/g, function(x){
		        i++;
				// var key = x.slice(2,-2);
				// console.log(vals);
				 //console.log(key);
				return content;
				 
			 });
			 if(ui !== undefined)
	          {
				  var shtml = require('simple').shtml;
				 ui = shtml.inline(ui);
				 return ui;
			  }
			  else 
			    return "";
	         
		 }
		 catch(err)
		 {
			 console.log(err)
		 }
			
			
}



ajsloadable.prototype.output = function(resp,ui,fname,cache)
{
	if(cache == true)
	{
	if((resp.cache !== undefined && !resp.cache.cacheFile(fname, true)) || resp.cache == undefined)
		      resp.cache.writemime('html',fname,'text',true);
	}
	//else 
	  
	  this.zoutput(resp,ui,fname);
	 //resp.cache.writemime('html',ui,fname,'text',true);
	  
			
}

ajsloadable.prototype.zoutput = function(resp,ui,fname)
{
	       var zlib = require('zlib');
			 if(resp.compress !==undefined && resp.compress.compress === true)
			 {
				  //var raw = fs.createReadStream('index.html');
				  if (resp.compress.acceptEncoding.match(/\bdeflate\b/)) {
                     zlib.deflate(ui, function (err, buffer) {
						 try{
						 if (err) 
						 {
							console.log(err);
						    resp.end({"error":err}); 
						  }
						 resp.writeHead(200, {
							 'Content-Encoding': 'deflate'
							  },{'Content-Type':'text/html'});
							  resp.end(buffer);
						 }
						 catch(err)
						 {
							 console.log(err ,'catcherror');
						 }
							 
					  
					 });
                     } 
					 else if (resp.compress.acceptEncoding.match(/\bgzip\b/)) {
						  zlib.gzip(ui, function (err, buffer) {
						 if (err){ console.log(err);
						     resp.end({"error":err});
						 }
						 else
						 {
                         resp.writeHead(200, { 'content-encoding': 'gzip' },{'Content-Type':'text/html'});
						  
						  resp.end(buffer);
						 }
						  
                   });
			 }
			 }
			 else
			 {
	         resp.writeHead(200, {'Content-Type':'text/html'});
			 resp.write(ui);	
			 resp.end("");
			 }
			 
}



ajsloadable.prototype.loadviewpart=function(view,resp,req)
{
	//console.log(resp);
	var obj = this;
	var fs = require('fs');
	 var path = req.viewpath(view);
	 if(path !== '')
	 {
	if((resp.cache !== undefined && !resp.cache.cacheFile(path,true)) || resp.cache === undefined)
	{
	 var res =fs.readFileSync(path);
	 
		
		 //console.log(this.html); 
		 obj.html += res.toString();
		 var shtml = require('simple').shtml;
		  shtml.req = req;
	     obj.html = shtml.inline(obj.html);
	}
		
	
	 }
	 else	
	 {
		 resp.writeHead(404, {'Content-Type':'text/html'});
	     resp.end("404 : content not found");
	 }	  
	  
			  
			
	//return res.toString();
}

ajsloadable.prototype.showLoadedViews = function(args,resp)
{  
	
	if(this.html !=='')
	{
	  
	  var ui = this.parse(args, this.html)
	  //console.log(this.html);
	  this.zoutput(resp, ui);
	  this.html = "";
	}
	else
	 {
		 resp.end('');
	 }
}



ajsloadable.prototype.model = function(model)
{
	
	var mod = require('../application/model/'+model);
	//console.log(mod);
	return mod;
	
}
ajsloadable.prototype.showintemplate =function(tempname,args,resp,cch)
{
	console.log('ioio');
	if(cfg.templatable = true)
	{
		//var viewpath = cfg.viewpath+tempname;
		this.view(tempname, args,resp,'templates',cch,true);
	}
}
module.exports = new ajsloadable();