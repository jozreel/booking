var session = function(requ, res){
	
	this.req = requ;
	this.resp=res;
	this.sessionVars={};
	this.sessionreqvars={};
	this.expmins =60;
	
	//console.log(this.bla);
	//this.parseCookies();
}
session.prototype.start = function()
{
	this.getsessiondata();
}
session.prototype.makeCookie = function(cname, cvalue, expmins)
{
	var d = new Date();
	d.setTime(d.getTime() + (expmins*60*1000));
	var exp = 'expires='+d.toUTCString();
	this.expiretime =exp;
	var ck = cname + "=" + cvalue + "; " + exp;
	return ck;
}

session.prototype.getCookie =function(cname)
{
	/*//console.log(this.req.headers.cookie);
	var name = cname+'=';
	var ckArray= this.req.headers.cookie.split(';');
	for(var x in ckArray)
	{
		var c = ckArray[x];
		while(c.charAt(0)==' ') c= c.substring(1);
		if (c.indexOf(name) == 0) 
		return c.substring(name.length, c.length);
	}
	return "";
	*/
}

session.prototype.addtosessionlist =function(sesid, expdate)
{
	var fs = require('fs');
	var cfg = require('../config/config');
	var fstat;
	var obj={};
	try{
	   fstat = fs.statSync(require('path').normalize(cfg.tmppath+'/sessions/sessionlist.spf'));
	  }
	  catch(err){
		  
	  }
	try{
	if(fstat !==undefined)
	  {
	   var data = fs.readFileSync(cfg.tmppath+'/sessions/sessionlist.spf');
	   obj = JSON.parse(data); 
	  }
	obj[sesid] = expdate;
	fs.writeFileSync(cfg.tmppath+'/sessions/sessionlist.spf', JSON.stringify(obj)); 
	}
	catch(err)
	{
		console.log(err);
	}
	
}

session.prototype.end = function()
{
	var ck =[];
	//expires=Thu, 01 Jan 1970 00:00:00 UTC";
	if(Object.keys(this.sessionreqvars).length === 0)
	{
	
	this.getsessiondata();
	}
	//console.log('endin',this.sessionreqvars);
	var fs=require('fs');
	fs.unlink(require('path').normalize(require('../config/config').tmppath+'/sessions/'+this.decrypt(this.sessionreqvars.sessionid)+'.spf'), function(err){
		if(err)
		  console.log(err);
		 
	});
	for(var ses in this.sessionreqvars)
	{
		
		ck.push(ses + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/');
		
	}
	
	this.resp.setHeader('Set-Cookie', ck);
	
	return ck;
}

session.prototype.createid = function()
{
	var stng = new Date().getTime().toString()+Math.floor((Math.random() * 1000000) + 1);
	return stng;
}

session.prototype.updatefile = function()
{
   var sob =this;
	var fs = require('fs');
	var cfg = require('../config/config');
	//var stng = this.createid();
	var ck =[];
	try{
	 fs.writeFileSync(cfg.tmppath+'/sessions/'+this.decrypt(this.sessionVars.sessionid)+'.spf', JSON.stringify(this.sessionVars)); 
	  this.addtosessionlist(this.decrypt(this.sessionVars.sessionid), this.decrypt(sob.sessionVars['expires']));
      //for(var ses in sob.sessionVars)
	//{
		
		
		//ck.push(ses + '='+ sob.sessionVars[ses] + ';expires=' +sob.decrypt(sob.sessionVars['expires'])+ '; path=/');
	    var sesstr = 'sessionid' + '='+ sob.sessionVars['sessionid'] +';expires=' +sob.decrypt(sob.sessionVars['expires'])+ '; path=/';
	//}
	
	sob.resp.setHeader('Set-Cookie', sesstr);
	
	
	}
	catch(err)
	{
		console.log(err);
	}
	
	
}

session.prototype.create = function()
{
	var fs = require('fs');
	var cfg = require('../config/config');
	var ck =[];
	var d = new Date();
	var fstat;
	var stng = this.createid();
	var tmpsessionfile = require('path').normalize(cfg.tmppath+'/sessions/'+stng+'.spf');
	  try{
	   fstat = fs.statSync(tmpsessionfile);
	  }
	  catch(err){
		  
	  }
	var i=0;
	try
	{
	while(fstat !==undefined)
	{  i++;
		stng = this.createid();
		//use set timeout instead.
		if(i===100)
		  break;
	}
	  
	d.setTime(d.getTime() + (this.expmins*60*1000));
	var exp = 'expires='+d.toUTCString();
	this.sessionVars.expires = this.encrypt(d.toUTCString());
	
	this.sessionVars.sessionid = this.encrypt(stng);
	//for(var ses in this.sessionVars)
	//{
		
		var str =  'sessionid' + '='+ this.sessionVars['sessionid'] + ';expires=' +exp+ '; path=/';
		
	//}
	//ck = ck.slice(0,-1);
	//console.log(str);
	
	this.resp.setHeader('Set-Cookie', str);
	
	
	//console.log(stng);
	
	
	//console.log(tmpsessionfile);
	
	   
	
	
	if(fstat ==undefined)
	  {
		 for(var sesdata in this.sessionVars)
		    this.sessionreqvars[sesdata] = this.sessionVars[sesdata];
		  
	   fs.writeFile(cfg.tmppath+'/sessions/'+stng+'.spf', JSON.stringify(this.sessionVars), function(err){if(err) console.log(err)});
	   this.addtosessionlist(stng, exp);
	  }
	}
	catch(err)
	{
		console.log(err);
	}
	return ck;
}

session.prototype.objlength = function(obj)
{ var length = 0;
   try{
	   
   
	for(var key in obj)
	  length++;
   }
   catch(error)
   {
	   console.log(error);
   }
  return length;
}
session.prototype.set =function(cname,value)
{
	var val = this.encrypt(value);
	// var ck = this.makeCookie(cname,val, 10);
	 //this.resp.setHeader('Set-Cookie', ck);
	 this.sessionVars[cname]=val;
	 
	// console.log(this.req.session.name);
}

session.prototype.get = function(cname)
{
	 
	if(Object.keys(this.sessionreqvars).length === 0)
	{
	 
	  this.getsessiondata();
	
	}
	 var ck = this.sessionreqvars[cname];
	 
	
	
	
	 if(ck)
	 {
	  ck = this.decrypt(ck);
	  
	  return ck;
	 }
	  else
	  return "";
	   
	// this.resp.setHeader('Set-Cookie', ck);
}

session.prototype.parseCookies = function()
{
	
	//console.log('hi');
	for(var x in this.req.session)
	{
		
		
		if(x!=='req' || x!=='resp')
		     this.set(x,this[x]);
	}
}

session.prototype.add = function(name,val)
{
	this.modify(name,val);
}

session.prototype.change = function(name,val)
{
	this.modify(name,val);
}

session.prototype.modify = function(name,val)
{  
	if(Object.keys(this.sessionreqvars).length === 0)
	{
		
	     this.getsessiondata();
	}
	if(Object.keys(this.sessionreqvars).length>0)
	{
	
	for(var sv in this.sessionreqvars)
	  
	  this.sessionVars[sv] = this.sessionreqvars[sv];
	  
	 this.sessionVars[name] = this.encrypt(val);
	//this.end();
	
	this.updatefile();
	}
	
	
	
}

session.prototype.refresh = function()
{
	//this.getallCookies();
	this.getsessiondata();
	console.log(this.sessionreqvars);
	if(Object.keys(this.sessionreqvars).length>0)
	{
		
	for(var sv in this.sessionreqvars)
	  this.sessionVars[sv] = this.sessionreqvars[sv];
	this.end();
	this.create();
	}
	
}


session.prototype.getallCookies =function()
{
	
	
	//console.log(this.sessionVars);
	 // var name = cname+'=';

	// console.log(this.req);
	var ckArray=[];
	if(this.req.headers.cookie)
	{
	  ckArray= this.req.headers.cookie.split(';');
	  
	for(var x in ckArray)
	{
		var c = ckArray[x];
		while(c.charAt(0)==' ') c= c.substring(1);
		var ns = c.split('=');
		if( this.sessionreqvars[ns[0]])
		{
			//console.log('in');
		   delete this.sessionreqvars[ns[0]];
		   this.sessionreqvars[ns[0]]=ns[1];
		}
		else
		 this.sessionreqvars[ns[0]]=ns[1];
		
		
	}
	
    if(this.sessionreqvars.expires !==undefined)
	{
		var d = new Date(this.sessionreqvars.expires);
		//console.log(d);
		var now = new Date();
		var diff = Math.abs(now.getTime() -d.getTime())
		if(diff >0)
		  this.sessionreqvars.isexpired ='false';
		else
		   this.sessionreqvars.isexpired = 'true';
	}
	else
	  this.sessionreqvars.isexpired = 'true';
	}
	
	
}

session.prototype.getsessiondata =function()
{
	
	
	//console.log(this.sessionVars);
	 // var name = cname+'=';

	// console.log(this.req);
	
	var ckArray=[];
	if(this.req.headers.cookie)
	{
		
	 ckArray= this.req.headers.cookie.split(';');
	
	for(var x in ckArray)
	{
		
		var c = ckArray[x];
		while(c.charAt(0)==' ') c= c.substring(1);
		
		var ns = c.split('=');
		if(ns[0] ==='sessionid')
		{
		
		this.isset = true;
		var sessid = this.decrypt(ns[1])
		var cfg = require('../config/config');
		var fs=require('fs');
		var data = fs.readFileSync(cfg.tmppath+'/sessions/'+sessid+'.spf');
       
	    this.sessionreqvars = JSON.parse(data);
		 
		
		if( this.sessionreqvars[ns[0]])
		{
			
			//console.log('in');
		   delete this.sessionreqvars[ns[0]];
		   this.sessionreqvars[ns[0]]=ns[1];
		   
		}
		else
		 this.sessionreqvars[ns[0]]=ns[1];
		}
		
		
	}
	
    if(this.sessionreqvars.expires !==undefined)
	{
		var d = new Date(this.sessionreqvars.expires);
		//console.log(d);
		var now = new Date();
		var diff = Math.abs(now.getTime() -d.getTime())
		if(diff >0)
		  this.sessionreqvars.isexpired ='false';
		else
		   this.sessionreqvars.isexpired = 'true';
	}
	else
	  this.sessionreqvars.isexpired = 'true';
	}
   
	
}


var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

session.prototype.encrypt = function(text){ console.log(text);
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
session.prototype.decrypt = function(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = session;






