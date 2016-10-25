
var simplecontroler = function ()
{
 //console.log('creating control');
   this.req=null;
   this.res=null;
   this.counter = 0;
   
   
   
   
}
simplecontroler.prototype.create= function(resp,req)
{
	//console.log('hello');
 
  this.res = resp;
  this.req=req
  this.load  = require('./ajsload');
  this.viewholder ={};
  var host='';
   var prt = this.req.headers.host.indexOf(':');
  if(prt !==-1)
  {
	  this.req.hostname = this.req.headers.host.substring(0,prt);
	 
  }
  else
  {
	  this.req.hostname = this.req.headers.host;
  }
  
}
simplecontroler.prototype.writeres= function(txt)
{
	//console.log(this.req);
 this.res.write(txt);
}
simplecontroler.prototype.loadview = function(vw,customlayout)
{
	       var vh = this.viewholder;
        var urlencode = require('./urlencode');
        urlencode = new urlencode();
     
	    for(var i= 0; i< Object.keys(vh).length; i++)
        {
          var key = Object.keys(vh)[i];
          if(typeof this.viewholder[key] === 'string' )
             this.viewholder[key] = urlencode.addspecial(this.viewholder[key]);
        }
       
		return this.load.view(vw,this.viewholder,this.res,this.req,false,true,customlayout);
	
	
	
	
}

simplecontroler.prototype.loadviewpart = function(view)
{
	 //console.log('hi');
		return this.load.loadviewpart(view,this.res,this.req);
	
	
}

simplecontroler.prototype.showviews = function(res)
{
	 //console.log('hi');
		return this.load.showLoadedViews(this.viewholder,res);
	
	
}

simplecontroler.prototype.loadmodel = function(name)
{
	    var mod =this.load.model(name);
       
		return mod;
	
	
}

simplecontroler.prototype.setSocket =function(sock)
{
	//console.log(sock);
	this.socket = sock;
}

simplecontroler.prototype.jsonResp =function(r,space)
{
	if(space===undefined)
       space=0;
      try{
        
        this.res.statusCode = 200;
	   this.res.setHeader('Content-Type','application/json');
	   var jsn = JSON.stringify(r,null,space);
	   
	    this.res.end(jsn);
	  }
	  catch(err)
	  {
		  console.log(err,'error');
		  this.res.end(JSON.stringify({error:err}));
	  }
		
		
}

simplecontroler.prototype.showtemplate =function()
{var res = this.res;
  var cfg = require('../config/config');
  var temp = require('./template');
  var template = new temp()
  var sc= this;
	//var tempname = this.templatename;
	if(cfg.templatable ===true)
	{
		//console.log('inthis');
		this.templateid = cfg.templateid;
		template.loadtemplate(this.templateid, function(arr,tname, err)
		{
			//console.log(arr);
			//for(var att in arr.media)
			//{
				
			//}
			if(arr.success !==undefined && arr.success ===false)
			 sc.jsonResp(arr);
			else
			  sc.load.showintemplate(tname,arr,res,false);// use this as the callback to load template;
		}
		);
		
	}
}

simplecontroler.prototype.isencrypted=function(){
	 if(this.req.connection.encrypted !==undefined)
	    return true;
	 else 
	   return false;
}

simplecontroler.prototype.requesthttps = function(hname,pth,options)
{
	
	var http = require('https');
	var opt = {};
if(options !==null)
    opt =options;
else
  opt  = {
  hostname: hname,
  port: 80,
  path: pth,
  method: 'POST',
  }
  var req = http.request(options, function(res) {});
}
simplecontroler.prototype.sendFile = function(fileName)
{
    var fs = require('fs');
   
    var path = require('path');
    var correctfname = path.normalize(fileName);
    
    var file = path.basename(fileName);
    fs.exists(correctfname,(exist)=>{
     
       if(exist)
       {
           this.res.statusCode=200;
           this.res.setHeader('Content-Type','application/octet-stream');
           this.res.setHeader('Content-Disposition','attachment; filename=' + file);
           fs.createReadStream(correctfname).pipe(this.res);
       }
       else 
       {
                   this.res.writeHead(400, {"Content-Type": "text/plain"});
                   this.res.end(JSON.stringify({error:"ERROR File does NOT Exists"}));

       }
    });
}

module.exports = simplecontroler;