var reqarr;
var viewHolder = {};
var head=[];
var shtml = function()
{
  
}
shtml.prototype.clearHead = function()
{
	
	
	head = [];
	printbuffer ="";
	
}
shtml.prototype.setViewHolder = function(val)
{  
	viewHolder = val;
}
shtml.prototype.inline = function(dt)
{  ///\$(?!\{)([\S]+[\);])
	
	return this.parseforeval(dt, /\$(?!\{)([\S \w]+[\);])/g);//  \$([\w\("'\.\+\-\*\/\^\%]+[);])    /\$([\S]+[\);])/g
}
//work on this function has errors 
shtml.prototype.block = function(dt)
{
	return this.parseforeval(dt,/\$\{([\S\s+\r\n]+)\}\$/g);//\${([\w\s.\(\);"'\+\-\.\*\/\%\&\|.]*)}
}
shtml.prototype.parseforeval = function(dt,pattern)
{
	reqarr = this.req.viewpath;;
	var ui ='';
	var cfg  = require('simple').config
	var fs = require('fs');
	var pt = require('path');
	var i=0;
	var ret = false;
	ui = dt.toString().replace(pattern, function(x,y,z){	
	   try{	 
		   i++;
		   var res = '';
		   //\${([\w\s]*)}
		  
		     res =  eval(y);
		   
		 // return res;
		 // var path = cfg.viewpath + '/'+y+'.html';
		 // path = pt.normalize(path);
	     // var res =fs.readFileSync(path);
	      if(res !==undefined)
		    return res;
		  
		 //else
		  // return '&nbsp';
				 
	   }
	   catch(err){console.log('error',err);}
				 
			 });
	
	 if(ui !== undefined)
	 {
	  
	  if(i!==0 )
	     ui = this.parseforeval(ui);
	  
      return ui;
	  
	 }
	 else return '';
}

shtml.prototype.loadpart =function()
{
	
}


var getviewpart= function(vname)
{
	var ui ='';
	var cfg  = require('simple').config
	var fs = require('fs');
	var pt = require('path');
	var i=0;
	var ret = false;
	
	var path = reqarr(vname);
	
	if(path !== '')
	{
		 // var path = cfg.viewpath+vname+'.html';
		  path = pt.normalize(path);
	     var res =fs.readFileSync(path);
	     if(res !== undefined)
		  return res.toString();
		 else
		   return '&nbsp';
	}
				
}




var printbuffer ='';
var print = function(text)
{
	printbuffer += text
	return printbuffer.toString();
}

shtml.prototype.parse = function(dt)
{
	var ui ='';
	var cfg  = require('simple').config
	var fs = require('fs');
	var pt = require('path');
	var i=0;
	var ret = false;
	ui = dt.replace(/\$html\((\w+)\);/g, function(x,y,z){	
	   try{	 
		   i++;
		  // console.log(y);
		   
        var path = reqarr(y);
	   if(path !== '')
	    {
	     var res =fs.readFileSync(path);
	     if(res !== undefined)
		  return res.toString();
		 else
		   return '&nbsp';
		   }
				 
	   }
	   catch(err){console.log(err);}
				 
			 });
	
	 if(ui !== undefined)
	 {
	  if(i!==0 )
	     ui = this.parse(ui);
	  
      return ui;
	  
	 }
	 else return '';
}

shtml.prototype.parseconfig = function(dt, partern)
{
	var ui ='';
	var cfg  = require('simple').config
	var fs = require('fs');
	var pt = require('path');
	var i=0;
	var ret = false;
	
	ui = dt.replace(partern, function(x,y,z){	
	   try{	 
		   i++;
		  // console.log(y);
		   
		  var path = cfg[y];
		  path = pt.normalize(path);
	    // var res =fs.readFileSync(path);
	   //  if(res !== undefined)
		  return path.toString();
		// else
		 //  return '&nbsp';
				 
	   }
	   catch(err){console.log(err);}
				 
			 });
	
	 if(ui !== undefined)
	 {
	  if(i!==0 )
	     ui = this.parse(ui);
	  
      return ui;
	  
	 }
	 else return '';
}

shtml.prototype.parseother = function(dt, partern,callback)
{
	var ui ='';
	var cfg  = require('simple').config
	var fs = require('fs');
	var pt = require('path');
	var i=0;
	var ret = false;
	
	ui = dt.replace(partern, function(x,y,z){	
	   try{	 
		   i++;
		  
		  return callback(y) 
		 // var path = cfg[y];
		  //path = pt.normalize(path);
	    // var res =fs.readFileSync(path);
	   //  if(res !== undefined)
		 // return path.toString();
		// else
		 //  return '&nbsp';
				 
	   }
	   catch(err){console.log(err);}
				 
			 });
	
	 if(ui !== undefined)
	 {
	  if(i!==0 )
	     ui = this.parse(ui);
	  
      return ui;
	  
	 }
	 else return '';
}

shtml.prototype.baseurl= function(str)
{
	
  return this.parseconfig(str, /(\$_BASEURL)/g)	
}

shtml.prototype.addlink = function(str)
{
	
	return this.parseother(str, /\$link\(([-A-Z0-9+&@#\/%?=~_|!:,.;]*[A-Z0-9+&@#\/%=~_|])\);/g, function(y){ return 'link rel="import" href="'+y+'"'; console.log(y);});
}
shtml.prototype.updatepageheader = function(str)
{
	
    var hstr = updateHtmlHeader();
	hstr+='</head>'
	 var regx = /<\/\s*head\s*>/i;
	//var match = regx.exec(str);
	var rets =str.replace(regx,hstr);
	return rets;
	//console.log(match);
}
function updateHtmlHeader()
{ var str = '';
    
	for(var hd in head)
	{
		
		str += head[hd].toString() +'\r\n';
	}
	return str;
}

function addToHead(val)
{
	head.push(val);
	return "";
}
module.exports = new shtml();




