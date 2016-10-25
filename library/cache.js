var cache = function(req, res)
{
	this.req= req;
	this.res= res;
}

cache.prototype.cacheFile=function(fname, isview)
{
	try{
	var path = '';
	var cfg = require('../config/config');
	if(isview)
	 path = fname;
	else	
	 path = cfg.publicpath + '/'+fname;
	var fs = require('fs');
	
	var stats = fs.statSync(path);
	var mtime = stats.mtime;
	var size = stats.size;
	
	  // console.log(fname);
	var modSince = this.req.headers["if-modified-since"];
	//console.log(modSince);
	
	if(modSince !=null)
	{
		//console.log(modSince);	
	   modSince = new Date(modSince);
	if(modSince.getTime()==mtime.getTime())
	{
		//console.log('ended');
	  if(this.res.compress !==undefined && this.res.compress.compress === true)
      {
        this.res.statusCode = 304;
	    this.res.setHeader("if-modified-since",mtime.toUTCString());
        this.res.setHeader('content-encoding', 'deflate');
      }
	  else
      {
       this.res.statusCode = 304;
       this.res.setHeader("if-modified-since",mtime.toUTCString());
      }
      this.res.end();
		
		return true;
	}
	else
	   return false;
	}
	return false;
	}
	catch(err)
	{
		console.log(err);
	}
}

cache.prototype.writemime =function(ext,fname,mime,isview)
{
	
	try{
	//console.log(fname);
	var cc;
	var ex;
	var prag;
	var obj = this;
	if(this.Cache_Control!=null) cc= this.Cache_Control; else cc = 'max-age=600';
	
	var cfg = require('../config/config');
	if(isview ===true)
	 path = fname;
	else
	  var path = cfg.publicpath + '/'+fname;
	var fs = require('fs');
	var stats = fs.statSync(path);
	var mtime = stats.mtime;
	var size = stats.size;
	this.res.setHeader("Cache-Control",cc);
	if(this.pragma !=null)
	{
		prag= this.Pragma;
		this.res.setHeader('Pragma', prag);
	}
	else this.res.setHeader('Pragma', 'no-cache');
	//console.log(ext);
	if(this.Expires!=null) 
	{
		ex= this.Expires;
	   var d =new Date();
	   d.setMinutes(d.getMinutes()+ex);
	
    this.res.setHeader("Expires", d.toUTCString());
	}
	else
	  this.res.setHeader("Expires", '-1');
	 this.res.setHeader('Last-Modified', mtime);
	//console.log(this.res);
	//this.res.writeHead(200, {'Content-Type':mime+'/'+ext});
	
	/*if(this.res.compress !==undefined && this.res.compress.compress === true)
			 {
				  var zlib = require('zlib');
				  //var raw = fs.createReadStream('index.html');
				  if (this.res.compress.acceptEncoding.match(/\bdeflate\b/)) {
                     zlib.deflate(data, function (err, buffer) {
						 if (err) throw err;
						 obj.res.writeHead(200, {'content-encoding': 'deflate'},{'Content-Type':mime+'/'+ext});
							   
						   
						 
						  if(mime !=='text')
	                        obj.res.end(buffer,'binary');
						   else
	                        obj.res.end(buffer);
							  
					  
					 });
                     } 
					 else if (this.res.compress.acceptEncoding.match(/\bgzip\b/)) {
						  zlib.gzip(data, function (err, buffer) {
						 if (err) throw err;
                            obj.res.writeHead(200, { 'content-encoding': 'gzip' }, {'Content-Type':mime+'/'+ext});
						   // obj.res.writeHead(200, {'Content-Type':mime+'/'+ext});
						 
						  if(mime !=='text')
	                          obj.res.end(buffer, 'binary');
						else
	                       obj.res.end(buffer);
						 
                   });
			 }
			 }
			 else{
	           this.res.writeHead(200, {'Content-Type':mime+'/'+ext})
	           
	           if(mime !=='text')
	           this.res.end(data, 'binary');
	           else
	           this.res.end(data.toString());
			 } */
	}
	catch(err)
	{
		console.log(err);
	}
	  // console.log(mime);
	  
}

module.exports = cache;