
var mongo = require('./mongodriver');

var simplemodel = function(p) {
  this.modelname ='default';
}
simplemodel.prototype= new mongo();
simplemodel.prototype.constructor = simplemodel;

simplemodel.prototype.save = function(callback, event)
{
  var temp =this.prepare();
   //console.log(this);
   delete temp._id;
   
  
   if(event ==='A')
     this.insert(temp,callback);
   if(event ==='E')
    { 
     
      var objid = this.createObjectId(this._id)
      
      //console.log(temp);
      this.updateOne({_id:objid},temp, callback);
    }
  
}


simplemodel.prototype.decodeallValues = function(doc)
{var obj;
 
  for(var val in doc)
  {
    
    if(typeof doc[val] ==='object')
    {
      this.decodeallValues( doc[val]);
    }
    else if(typeof doc[val] !== 'function')
    {
     
     doc[val] = this.checkanddecode(doc[val]);
    // console.log(val);
    }
   //if(typeof obj !== 'undefined')
    //doc[val] = obj;
    
    
  }
  return doc;
}

simplemodel.prototype.convertobase64 =function(data)
{
   var b ='';
   var Buffer =require('buffer').Buffer;
   var bff;
  if(data !=undefined && typeof data === 'string')
    {
     b= new Buffer(data,'binary').toString('base64');;
    
    }
   
  return b;
}


simplemodel.prototype.page=function(quer, limit,last,fields,callback)
{
  var smd = this;
  
  this.recordcount(function(count)
  {
  
  if(limit > count)
    limit= count;
  var options = {"limit":limit, "skip":last, "sort":"name"};

  smd.find(quer,fields,options,true,function(doc)
  {
     
     var decd = smd.decodeallValues(doc);
      
      
      callback(decd);
      
  });
  });
}

simplemodel.prototype.prepare =function()
{
  var temp = {};
   var props = Object.getOwnPropertyNames(this);
  
	for(var x in props)
	 {
   //  console.log(typeof this[props[x]]);
		 if((typeof this[props[x]] === 'function') ||(props[x] ==='modelname'))
     { 
      continue
     }
       temp[props[x]] = this[props[x]];
	 }
   
   return temp;
}
simplemodel.prototype.deleteone = function(callback)
{
 // console.log(this);
  var objid = this.createObjectId(this._id);
  this.removeone({_id:objid},callback);
}

simplemodel.prototype.gridsave = function(fdata,callback,event)
{
   var temp =this.prepare();
   //console.log(this);
   //delete temp._id;
   //console.log(temp);
   
     this.savetogrid(fdata,temp,callback,event);
}

simplemodel.prototype.checksendtogrid= function(size,ll)
{
  if(size > 1600000.0)
    return true;
   else
     return false;
    
}

simplemodel.prototype.checkanddecode =function(str)
{
 
  var retstr="";
  try {
    var res = decodeURIComponent(str);
    retstr = res;
    
  }
  catch(ex)
  {
    console.log('not escaped');
     retstr =str
  }
 
  /*
  try{
  var regx = new RegExp(/%\d[\dA-F]/g);
  var test =regx.test(str);
 
		if(test)
		{
		
     retstr= decodeURIComponent(str);
        //widget.innerHtm = obj.htm;
			//console.log('hi');
      
		}
    else
    {
      retstr =str;
    }
  }
  catch(err)
  {
    console.log(err);
  }*/
    return retstr;
}


simplemodel.prototype.checkencoded =function(str)
{
  var retstr="";
  var regx = new RegExp(/%\d[\dA-F]/g);
  try {
    var res = decodeURIComponent(str);
    retstr = str;
    
  }
  catch(ex)
  {
    console.log('not escaped escaping now');
     retstr =encodeURIComponent(str);
  }
 
/*  var test = regx.test(str);
   console.log(test);
		if(test)
		{
		  
     retstr= str;
        //widget.innerHtm = obj.htm;
			//console.log('hi');
		}
    else
    {
      retstr =encodeURIComponent(str);
    }*/
    return retstr;
}





module.exports = simplemodel;

