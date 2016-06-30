var load = require('./ajsload');
var template = function(){
	
}
template.prototype.loadtemplate = function(tid,callback)
{   
	var cont = this;
	var mod =load.model('template');
	var widgetobj={};
	//widgetobj.media =[];
	//console.log(mod);
	mod.find({templateid:parseInt(tid)},null,false,function(doc){
		var i=0;
		
		if(Object.keys(doc).length === 0)
		 callback({success:false,error:"empty set"});
		
		for(var wid in doc.tarray)
		{
			
			
			cont.loadwidget(doc.tarray[wid],
			function(arr,med){
				
				i++;
				for (var attrname in arr) {
				//if(attrname !== 'media')
				//{
					widgetobj[attrname] = arr[attrname];
				//}
			    }
				for (var medname in med) {
				//if(attrname !== 'media')
				//{
					if(widgetobj[medname] === undefined)
					   widgetobj[medname] = med[medname];
				//}
			    }
				//widgetobj.media.push(arr.media);
				//arr[wid]
				//widgetobj
				if(i === doc.tarray.length)
				{
					
				   callback(widgetobj, doc.templatename);
				}
			     
			});
		  
		}
	
		//console.log(widgetobj);
		
	});
	
}
template.prototype.loadwidget = function(wid,callback)
{
	var tempobj ={};
   //console.log(itt,count);
	var cont = this;
	var mod =load.model('widget');
	
	
		
	mod.find({widgetid:parseInt(wid)}, null, false,function (doc)
		{
			
			   
			console.log('step');
			//var newitt = itt;
	         var htm = decodeURI(doc.innerHtm);
	       
	
	        if(doc.media.length >0)
	        {
	          cont.loadmedia(doc.media, function(arr)
	         {
			    //arr[wid] = htm;
				tempobj[wid] = htm;
				//tempobj['media']=arr
				
		        callback(tempobj,arr);
		        
			 });
	}
	else{
		
		//var arr = {};
		tempobj[wid] = htm;
		
		callback(tempobj);
		
	} 
   }
	);
}
	
	// mod.find({widgetid:parseInt(wid)}, null, false, function(doc){
	/*var newitt = itt;
	var htm = decodeURI(doc.innerHtm);
	var replace = doc.widgetid;
	
	if(doc.media.length >0)
	{
	cont.loadmedia(doc.media,function(arr)
	{
		//console.log(arr);
		/*for(var ind in arr)
		{
		  wo.ind = arr[ind];	
		}
		if(itt ===count)
		{
			console.log('ccj');	
		}*/
	   // arr.wid = htm;
		//callback(arr,itt);
		//if(itt===count)
		//{
			//console.log(wo); // i guess you could load the file here buut replace placeholders first
		//}
		 
	   //tmparr.push
	//});
	//}
	//else{
		
		//var arr = [];
		//arr.wid = htm;
		
		//callback(arr,itt)
	//}
	//parsetexthere
	//});
	
//}
template.prototype.loadmedia = function(media,callback){
	
	var cont = this;
	var i=0;
	//console.log(media);
	var temp= [];
	for(var med in media)
	{
		//console.log(media);
		i++;
		//console.log(media[med]);
		    if(media[med].type === 'image')
			{
				cont.findimage(media[med].medid,i,media.length,temp,callback);
			}
			else if(media[med].type === 'video')
			{
				cont.findvideo(media[med].medid,i,media.length,temp,callback);
			}
			else if(media[med].type === 'audio')
			{
				cont.findaudio(media[med].medid,i,media.length,temp,callback);
		
			}
			else
			{
				cont.findfile(media[med].fileid,i,media.length,temp,callback);
			}
		}
	
}

template.prototype.findimage = function(image,count,total,temp, callback)
{
	var Buffer =require('buffer').Buffer;
	var cont=this;
	var mod = load.model('image');
	mod.find({imageid:image},null, false,function(doc)
	{
		  var tmpdoc=''
		  
		//console.log(doc);
		var tmpobj = doc;
		var buffarr =[];
		mod.streamfromgrid(doc.gridid, function(doc,se,sc){
			if(doc!=null)
			{
				 buffarr.push(doc);
			}
			 // tmpdoc += doc;
			if(se)
			{
				tmpdoc= Buffer.concat(buffarr);
					
		        tmpdoc =  tmpdoc.toString('base64');
			  cont.itterate(tmpobj.imageid, tmpdoc,count, total,callback,temp);
			}
		});
		
	});
}
template.prototype.findvideo = function(video,count,total, callback)
{
	var cont=this;
	var mod =this.load.model('video');
	mod.find({videoid:video},null, false,function(doc)
	{
	   cont.itterate(doc.videoid,doc.videodata,count, total,callback);
	});
}

template.prototype.findaudio = function(audio,count,total, callback)
{
	var cont=this;
	var mod =this.load.model('audio');
	mod.find({audioid:audio},null, false,function(doc)
	{
		 cont.itterate(doc.audioid, doc.audioodata,count, total,callback);
	});
}
template.prototype.findfile = function(file, count,total, callback)
{
	var cont=this;
	var mod =this.load.model('audio');
	mod.find({fileid:file},null, false,function(doc)
	{
		cont.itterate(doc.fileid,doc.filedata,count, total,callback);
	});
}

template.prototype.itterate = function(id, data,count,total,callback,temp)
{
	//console.log(id);
	//console.log(id, data);
	temp[id] = data;
	if(count === total)
	{
		//console.log(temp);
		callback(temp);
	}
}

template.prototype.loopthrough =function(count,total, data, callback)
{
	if(count === total)
	{
		
		callback(data);
	}
}

/*function callback(tmparr)
{
	//var tmparr = {};
	tmparr[id] = data;
	
}*/


module.exports = template;