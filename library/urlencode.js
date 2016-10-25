var urlencode = function(req, res)
{
	this.req= req;
	this.res= res;
}


urlencode.prototype.checkandencode =function(str)
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
urlencode.prototype.checkandecode =function(str)
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
 /* var regx = new RegExp(/%\d[\dA-F]/g);
		if(regx.test(str))
		{
		  retstr= decodeURI(str);
     //retstr= str;
        //widget.innerHtm = obj.htm;
			//console.log('hi');
		}
    else
    {
      retstr =str;
    }*/
    return retstr;
}

urlencode.prototype.removespecial=function(str)
{
  
  console.log(str);
   var st =str.replace(/&amp;/g, '&')
            .replace(/&quot;/g,'"')
            .replace(/&#47;/g, '/')
            .replace(/&#39;/g, '\'')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/lt;/g, '<')
            .replace(/gt;/g, '>');
    console.log(st);
     return st;
}

urlencode.prototype.addspecial=function(str)
{
  
  console.log(str);
   var st =str.replace(/&/g,'&amp;')
            .replace(/"/g, '&quot;')
            .replace(/\\/g,'&#39;')
            .replace(/\//g,'&#47;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;');
    console.log(st);
     return st;
}


module.exports = urlencode;