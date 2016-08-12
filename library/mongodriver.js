
var DB = require('mongodb').Db;
var simple = require('simple');
var config = require('simple').config;
var mongodriver =function()
{
 
 this.MongoClient = require('mongodb').MongoClient;
 this.Server =  require('mongodb').Server;
 this.assert = require('assert');
 this.db = 'mongosb';
 this.connectionString = 'mongodb://'+config.dbuser+':'+config.passwd+'@'+config.dbserver+':'+config.dbport+'/'+config.db; //abuild from config;
 console.log(this.connectionString);
}
  mongodriver.prototype.crudConnet = function(){ 
	var db =new DB('bootik', new Server('localhost', 27017));
  // Establish connection to db
  db.open(function(err, db) {
    assert.equal(null, err);

    // Add a user to the database
    db.addUser('jozreel', 'pass', {roles:[
         { role: "readWrite", db: "bootik" },
         { role: "read", db: "products" },
         { role: "read", db: "sales" },
         { role: "readWrite", db: "accounts" }]},function(err, result) {
      assert.equal(null, err);

      // Authenticate
      db.authenticate('jozreel', 'pass', function(err, result) {
        assert.equal(true, result);

        // Logout the db
        db.logout(function(err, result) {
          assert.equal(true, result);

          // Remove the user
          db.removeUser('jozreel', function(err, result) {
            assert.equal(true, result);

            db.close();
          });
        });
      });
    });
  });
}

//b = new Mongo().getDB("myDatabase");
mongodriver.prototype.connect =function(){
  var obj = this;
  var db =new DB('bootik', new this.Server('10.0.3.159', 27017));
  db.open(function(err,db)
  {
    if(err)
     simple.global.logerror(err);
  });
  
  
/*MongoClient.connect("mongodb://dbuser:passwd@localhost:27017/bootik", function(err,db)
{
	if(err)
	   console.log(err);
  obj.db=db;

	var collection = db.collection('test');
	 var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
   // var user2 = {name: 'modulus user', age: 22, roles: ['user']};
   // var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};
   collection.insert([user1], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
	   db.close();
   });
      //Close connection
     // db.close();
     
}
);	*/
}



mongodriver.prototype.removeone = function(cat, callback)
{
  var res = {};
  res.success=true;
  var obj1 = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
   }
   else
   {
    var collection = db.collection(obj1.modelname);
    collection.deleteOne(
      cat,
      function(err, results) {
        try{
        if(err)
        {
           simple.global.logerror(err);
           res.error = err;
           res.success = false;
        }
        
         res.results = results;
         callback(res);
        }
        catch(error){simple.global.logerror(error);}
      }
   );
  }
  }
  );
  
}

mongodriver.prototype.removegroup = function(needle, catarr, callback)
{
  var pp='po';
  var conob ={};
  conob[needle]={$in:catarr}
  var res = {};
  res.success=true;
  var obj1 = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
      simple.global.logerror(err);
   }
   else
   {
    var collection = db.collection(obj1.modelname);
    collection.deleteMany(conob,
      function(err, results) {
        try{
        if(err)
        {
           simple.global.logerror(err);
           res.error = err;
           res.success = false;
        }
         
         res.results = results;
         callback(res);
        }
        catch(error){simple.global.logerror(error);}
      }
   );
  }
  }
  );
  
}

mongodriver.prototype.insert = function(obj,callback)
{
  //console.log(typeof callback);
  var obj1 = this;
  //console.log(this.MongoClient);
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    var res ={};
    res.success = true;
    if(err)
    {
      simple.global.logerror(err);
    }
    else{
      //console.log(obj);
      var collection = db.collection(obj1.modelname);
      collection.insertOne(obj,{w:1}, function(err, result){
        
        if(err)
        {
           res.success = false;
           res.error=err;
           simple.global.logerror(err);
        }
         db.close();
         if (callback && typeof(callback) == "function")  
              callback(res);
           
      });
    
  }
  }
  );
}


mongodriver.prototype.insertmany = function(obj,callback)
{
  //console.log(typeof callback);
  var obj1 = this;
  //console.log(this.MongoClient);
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    var res ={};
    res.success = true;
    if(err)
     {
      simple.global.logerror(err);
     }
     else{
      //console.log(obj);
      var collection = db.collection(obj1.modelname);
      collection.insertMany(obj,{w:1}, function(err, result){
        
        if(err)
        {
           res.success = false;
           res.error=err;
           simple.global.logerror(err);
        }
         db.close();
         if (callback && typeof(callback) == "function")  
              callback(res);
           
      });
    
  }
  }
  );
}



mongodriver.prototype.createObjectId =function(id)
{
  var retid ='';
  try{
  var Objectid = require('mongodb').ObjectID;
  if(id ===undefined || id === '')
     retid= new Objectid();
  else
    retid = new Objectid(id);
  }
  catch(error)
  {
    simple.global.logerror(error);
  }
  return retid;
}

mongodriver.prototype.updateOne =function(cat, vals, callback,upsert)
{var obj1 =this;
  if(upsert !== true)
    upsert == false;
  var res = {};
  res.success=true;
 //console.log(cat);
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      simple.global.logerror(err);
      res.error=err;
      res.success=false;
    }
    else
    {
       
      var collection = db.collection(obj1.modelname);
 
     // console.log(vals);
      collection.updateOne(cat, {$set: vals, $currentDate: { "lastModified": true }},{w:1,upsert:upsert}, function(err,result)
      {
        if(err)
          simple.global.logerror(err);
          db.close();
          if (callback && typeof(callback) == "function")  
              callback(res);
      }
      );
  }
  }
  );
}



mongodriver.prototype.pushtoarray = function(cat, vals,array, callback)
{var obj1 =this;
   var res = {};
  res.success=true;

  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      simple.global.logerror(err);
      res.error=err;
      res.success=false;
    }
    else
    {
       
      var collection = db.collection(obj1.modelname);
    var arr={};
    arr[array]={$each:vals};
   console.log(cat,arr);
     collection.updateOne(cat, {$push: arr }, function(err,result)
      {
        if(err)
        {
          simple.global.logerror(err);
         console.log(err);
        }
       
          db.close();
          if (callback && typeof(callback) == "function")  
              callback(res);
      }
      );
  }
  }
  );
}
//no duplicates
mongodriver.prototype.addtoarray = function(cat, vals,array, callback)
{var obj1 =this;
   var res = {};
  res.success=true;
 
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      simple.global.logerror(err);
      res.error=err;
      res.success=false;
    }
    else
    {
       
      var collection = db.collection(obj1.modelname);
    var arr={};
    arr[array]={$each:vals};
  
     collection.updateOne(cat, {$addToSet: arr }, function(err,result)
      {
        if(err)
        {
          simple.global.logerror(err);
         console.log(err);
        }
        
          db.close();
          if (callback && typeof(callback) == "function")  
              callback(res);
      }
      );
  }
  }
  );
}



mongodriver.prototype.updateinarray = function(cat, val, callback,upsert)
{var obj1 =this;
   var res = {};
  res.success=true;
  if(upsert === undefined)
    upsert = false;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      simple.global.logerror(err);
      res.error=err;
      res.success=false;
    }
    else{
       
      var collection = db.collection(obj1.modelname);
    
     
     collection.update(cat, {$set: val },{upsert:upsert},function(err,result)
      {
        if(err)
        {
          simple.global.logerror(err);
         console.log(err);
        }
          db.close();
          if (callback && typeof(callback) == "function")  
              callback(res);
          
      }
      );
  }
  }
  );
}


mongodriver.prototype.removefromarray = function(cat, val,multi, callback)
{var obj1 =this;
   var res = {};
  res.success=true;
  if(multi ===undefined)
    multi = false
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      simple.global.logerror(err);
      res.error=err;
      res.success=false;
    }
    else{  
      var collection = db.collection(obj1.modelname);
    
   
     collection.update(cat, {$pull: val },{multi:multi},function(err,result)
      {
        if(err)
        {
          simple.global.logerror(err);
         
        }
     
         
          if (callback && typeof(callback) == "function")  
              callback(res);
           db.close();
      }
      );
  }
  }
  );
}



mongodriver.prototype.updateMany =function(cat, vals,callback,upsert)
{var obj1 =this;
 //console.log(cat);
 if(upsert !== true)
    upsert == false;
 var res ={};
 res.success = true;
   this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      console.log(err);
      simple.global.logerror(err);
       res.error=err;
      res.success=false;
      //console.log(obj);
    }
    else
    {
      var collection = db.collection(obj1.modelname);
      collection.updateMany(cat, {$set: vals, $currentDate: { "lastModified": true }},{w:1,upsert:upsert}, function(err)
      {
        if(err)
        {
          simple.global.logerror(err);
          res.error=err;
         res.success=false;
        }
          if (callback && typeof(callback) == "function")  
              callback(res);
          db.close();
      }
      );
    }
  });
  
}
mongodriver.prototype.replace=function(id, rep)
{
  var obj1 = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
        simple.global.logerror(err);
    }
    else{
     var collection = db.collection(obj1.modelname);
     collection.replaceOne({'_id':id}, rep,{w:1}, function(err ,result) {
       if(err)
         simple.global.logerror(err);
         db.close();
     })
  }
  });
  
}

mongodriver.prototype.insertOrUpdate = function(obj,callback)
{
  
   var res ={};
   res.success = true;
   var obj1 = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      res.success=false
      res.error =err;
      simple.global.logerror(err);
    }
    else
    {
        
     var collection = db.collection(obj1.modelname);
      collection.save(obj,{w:1}, function(err, result)
      
      {
        if(err)
        {
           res.success=false
           res.error = err;
           
          
        }
        else
        {
            
            res.result=result.ops;
         if (callback && typeof(callback) == "function")  
              callback(res);
        }
        
      });
    }
  }
  );
}


mongodriver.prototype.savetogrid = function(filebuff,fdata,callback,event)
{
  //console.log(callback);
  var Buffer = require('buffer');
  var gd = require('mongodb').Grid;
  //console.log(gd);
  var obj1=this;
  //this.MongoClient
 
 var Grid = require('mongodb').GridStore
 //console.log(Grid);
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
    
   
    if(err)
    {
        simple.global.logerror(err);
    }
    
  
    var ObjectId = require('mongodb').ObjectID;
    var fileId = new ObjectId();
  
    var grid = new Grid(db,fileId,fdata.filename,'w',{root:'fs', content_type:fdata.type, metadata:fdata});
    grid.chunkSize = 1024 * 256;
   
    grid.open(function(err, grid) {
     var Step = require('step');
     Step(
       
       function writeData() {
         var group = this.group();
      var length = filebuff.length;
  
       grid.write(filebuff, group());
   
   },

   function doneWithWrite(vdd) {
     grid.close(function(err, result) {
       if(err)
       {
         var res={};
         res.sucess= false;
         res.error = err;
          callback(res);
          db.close();
       }
       else
       {
       console.log("File has been written to GridFS",result);
      
        fdata.gridid = result._id;
        
        if(event ==='A' || event === null|| event === undefined) 
          obj1.insert(fdata,callback);
        if(event === 'E')
        {
          var objid = obj1.createObjectId(obj1._id)
            delete obj1._id;
            obj1.updateOne({_id:objid.id},fdata, callback);
        }
        else(callback(result));
       
        db.close();
       }
        
        
        
     });
     
   }
 )
});
  });
}

mongodriver.prototype.streamfromgrid =function(fileid, callback, bulk)
{
 var Buffer = require('buffer');
  
  var obj1=this;
  //this.MongoClient
 
 var Grid = require('mongodb').GridStore
  var ObjectId = require('mongodb').ObjectID;
   // var fid =
   
 //console.log(Grid);
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
     console.log(err);
   }
   else{
   var grid = new Grid(db, new ObjectId(fileid),'r');
   
    grid.open(function(err,gs)
    {
    if(err)
    {
      console.log(err);
    }
    else
    {
      
      var stream = gs.stream(true);
      //console.log(stream);
      Grid.exist(db, new ObjectId(fileid), function(err, result) {
        if(err)
        {
          console.log(err,'');
        }
        else
        {
        // console.log(result,'exist');
        stream.on("data", function(chunk){
         //console.log('jojo');
          //console.log(chunk.toString());
          callback(chunk,false,false);
        });
     
      stream.on('end', function()
      {
       console.log('end');
        callback(null, true,false)
      });
       stream.on('close', function(data)
      {
        console.log('closed');
         callback(null, true,true)
        db.close();
       
      });
        
      }
      });
      }

      
    }
    );
    }
  }
  );

}


mongodriver.prototype.pipefromgrid =function(fileid, res)
{
 
  console.log('piping');
 var Grid = require('mongodb').GridStore
  var ObjectId = require('mongodb').ObjectID;
 
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
     console.log(err);
   }
   else{
   var grid = new Grid(db, new ObjectId(fileid),'r');
   
    grid.open(function(err,gs)
    {
    if(err)
    {
      console.log(err);
    }
    else
    {
      
      var stream = gs.stream(true);
      //.log(res);
      Grid.exist(db, new ObjectId(fileid), function(err, result) {
        if(err)
        {
          console.log(err,'');
        }
        else
        {
         
          decodeURI(stream.pipe(res));
         // res.end();
        }
        });

      
    }
    });
  }
  }
 );
}

mongodriver.prototype.streamt=function(fileid)
{
 
  var Buffer = require('buffer');
  
  var obj1=this;
  //this.MongoClient
 
 var Grid = require('mongodb').GridStore
  var ObjectId = require('mongodb').ObjectID;
   // var fid =
   
 //console.log(Grid);
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
    console.log(err);
   else
   {

      //var gridStore = new GridStore(db, new ObjectId(fileid), "w");
       Grid.read(db, new ObjectId(fileid), function(err, fileData) {
         // assert.equal(data.length, fileData.length);
         if(err)
         {
           console.log(err);
         }
         else{
         console.log(fileData.toString());
          db.close();
         }
        });
   }
  }
 );
  
}


mongodriver.prototype.getfromgrid = function(fileid, callback)
{
 var Grid = require('mongodb').GridStore;
 var ObjectId = require('mongodb').ObjectID;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else{
   
   var grid = new Grid(db, new ObjectId(fileid),'r');
    grid.open(function(err,gs)
    {
       gs.read(function(err, data) {
       
     callback(data);
    
  });
    });
   }
  });
}





mongodriver.prototype.findOne = function(cond,flds,opt,callback)
{
 
  
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
       
   // console.log(opt);
   if(opt === null)
     opt={};
    if(flds===null)
     flds={};
    var collection = db.collection(obj.modelname);
    if(opt!==null)
    {
     
    
          
            collection.findOne(cond,flds,opt,function(err,doc)
            {
                 callback(doc);
            }
            );  
            // db.close();
            
             
       
    }
    
  }
  );
  
}




mongodriver.prototype.recordcount = function(callback)
{
  
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   var collection = db.collection(obj.modelname);
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else
   {
     
      collection.find().count(function(err,count){
        {
          callback(count);
        }
      });
   }
  });
   
}

mongodriver.prototype.find = function(cond,flds,opt, coll,callback)
{
  
  
  var obj = this;
  
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else
   {
   // console.log(opt);
   if(opt === null)
     opt={};
    if(flds===null)
     flds={};
    var collection = db.collection(obj.modelname);
  
     
        
        collection.find(cond,flds,opt).count(function(err,count){ 
          if(err)
            {
             
              simple.global.logerror(err);
              console.log(err);
            }
          
          if(count >0){
            
             var cursor = collection.find(cond,flds,opt);  
             
             var retcount = count;
             if(opt.limit !== undefined && opt.limit <=count)
              retcount = opt.limit;
             obj.traverseCursor(cursor,db, callback,retcount,coll);
             
             } 
             else
             {   db.close();
                 callback({});
             }
        });
    
    
         ;
       /* collection.find(cond,flds,opt).count(function(err,count){ 
          if(count >0){
            
            var cursor = collection.find(cond,flds,opt);  obj.traverseCursor(cursor,db, callback,count,coll);
            }
             else 
             { 
               callback({});
              }
         });*/
     
  }
  }
  );
 
  
}

mongodriver.prototype.findAndSort = function(cond,flds,sort,coll,callback)
{
  
  
  var obj = this;
  
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else
   {
   // console.log(opt);
  
    if(flds===null)
     flds={};
    var collection = db.collection(obj.modelname);
  
     
        
        collection.find(cond,flds).count(function(err,count){ 
          if(err)
            {
             
              simple.global.logerror(err);
              console.log(err);
            }
          
          if(count >0){
           // if(coll)
            //  (collection.find(cond,flds).sort(sort)).toArray(err, function(dd){console.log(dd);}); 
             
            
             var cursor = collection.find(cond,flds).sort(sort);  
             
             var retcount = count;
             obj.traverseCursor(cursor,db, callback,retcount,coll);
             
             } 
             else
             {   db.close();
                 callback({});
             }
        });
    
    
         ;
       /* collection.find(cond,flds,opt).count(function(err,count){ 
          if(count >0){
            
            var cursor = collection.find(cond,flds,opt);  obj.traverseCursor(cursor,db, callback,count,coll);
            }
             else 
             { 
               callback({});
              }
         });*/
     
  }
  }
  );
 
  
}




mongodriver.prototype.findAndLimit = function(cond,flds,limit,coll,callback)
{
  
  
  var obj = this;
  
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else
   {
   // console.log(opt);
  
    if(flds===null)
     flds={};
    var collection = db.collection(obj.modelname);
  
     
        
       
            
             var cursor = collection.find(cond,flds).limit(limit);  
             
             var retcount = limit;
             
             
             obj.traverseCursor(cursor,db, callback,retcount,coll);
             
             
       /* collection.find(cond,flds,opt).count(function(err,count){ 
          if(count >0){
            
            var cursor = collection.find(cond,flds,opt);  obj.traverseCursor(cursor,db, callback,count,coll);
            }
             else 
             { 
               callback({});
              }
         });*/
     
  }
  }
  );
 
  
}


mongodriver.prototype.sortAndLimit = function(cond,flds,sort,limit,coll,callback)
{
  
  
  var obj = this;
  
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else
   {
   // console.log(opt);
  
    if(flds===null)
     flds={};
    var collection = db.collection(obj.modelname);
  
     
        
            // if(coll)
             // (collection.find(cond,flds).sort(sort)).toArray(err, function(dd){console.log(dd);}); 
            
             var cursor = collection.find(cond,flds).sort(sort).limit(limit);  
             
             var retcount = limit;
             
             
             obj.traverseCursor(cursor,db, callback,retcount,coll);
             
             
       /* collection.find(cond,flds,opt).count(function(err,count){ 
          if(count >0){
            
            var cursor = collection.find(cond,flds,opt);  obj.traverseCursor(cursor,db, callback,count,coll);
            }
             else 
             { 
               callback({});
              }
         });*/
     
  }
  }
  );
 
  
}

mongodriver.prototype.sortLimitSkip = function(cond,flds,sort,limit,skip,coll,callback)
{
  
  
  var obj = this;
  
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
       simple.global.logerror(err);
       console.log(err);
   }
   else
   { 
   // console.log(opt);
  
    if(flds===null)
     flds={};
    var collection = db.collection(obj.modelname);
  
     
        
       
            
             var cursor = collection.find(cond,flds).sort(sort).skip(skip).limit(limit);  
             
             var retcount = limit;
             
             
             obj.traverseCursor(cursor,db, callback,retcount,coll);
             
             
       /* collection.find(cond,flds,opt).count(function(err,count){ 
          if(count >0){
            
            var cursor = collection.find(cond,flds,opt);  obj.traverseCursor(cursor,db, callback,count,coll);
            }
             else 
             { 
               callback({});
              }
         });*/
     
  }
  }
  );
 
  
}


mongodriver.prototype.aggregate = function(pipelineoperatiors,callback)
{
  
  
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
      simple.global.logerror(err);
      console.log(err);
   }
   else
   {
  
    var collection = db.collection(obj.modelname);
 
      
     
       
         
          collection.aggregate(pipelineoperatiors).toArray(function(err,res)
          {
             callback(res);
             
             db.close();
          }); 
        
       
            
            //obj.traverseCursor(c,db, callback,0,true);
             
             
       
    
   } 
  }
  );
  
}




mongodriver.prototype.findall = function(callback,coll)
{
  
  var obj = this;
 
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    
    if(err)
    {
      
      console.log(err);
      simple.global.logerror(err);
      callback([{success:false, error:err}]);
    }
    else{
    var collection = db.collection(obj.modelname);
    collection.find().count(function(err,count){
      if(err)
      {
       
       console.log(err);
       simple.global.logerror(err);
      }
      if(count > 0)
      {
       var cussor = collection.find();
       
       
       obj.traverseCursor(cussor,db, callback,count,coll);
      }
      else
      {    
      callback([{success:false, error:'Empty set'}]);
      }
     
    });
  //  this.assert.equal(err,null)
   // obj.traverseCursor(cussor,db, callback);
    //callback(cussor);
    }
  }
  );
  
  
  
}


mongodriver.prototype.test = function()
{
    
}
//mongoDbDriver.prototype.save(obj)

mongodriver.prototype.getDb = function()
{
  //console.log(this.db);
  return this.db;
}
mongodriver.prototype.close = function()
{
  this.db.close();
}



mongodriver.prototype.traverseCursor =function(cursor,db, callback,count,coll)
 {
	 var obj=this;
   var itter = 0;
  var tmparr = new Array();
  if(count===0)
  {
    callback({error:true,message:"empty"});
  }
  else{
    

       if(coll === true)
       {
        
         cursor.toArray(function(err,dc){
             if(err !== null)
              {
                  
              }
             callback(dc);
            });
        
       
       }
       else
       {
       cursor.each(function(err, doc) {
          obj.assert.equal(err, null);
          if(doc!==null)
	      {
          
          itter++;
           callback(doc,count,itter);
          }
         }
  
	     );
          if(itter == count)
            db.close();
       }
    // 
		 
	  }
	
  }
  
    //console.log('door');
     
 //}
 
 
mongodriver.prototype.adsearch=function(needle, flds, opts, callback)
{
   var res = Array();
   var ids = Array();
  // var itter = 0;
   var obj = this;
    
     obj.find({},flds,opts, true, function(doc)
     {
      
    try{
    
      if(needle !== undefined)
      {   
      for(var indx in doc)
      {
         for(var obj in doc[indx])
         {
         if(typeof doc[indx][obj] === 'string')
           {
             
              if(doc[indx][obj].toLowerCase().match(new RegExp(needle.toLowerCase()),"i") !==null)
              {
                
               
               
                if(ids.lastIndexOf(doc[indx]['_id']) === -1)
                   {
                      
                     // console.log((doc[indx].search(new RegExp(needle,"i"))),doc[indx]);
                       res.push(doc[indx]);
                       ids.push(doc[indx]['_id']);
                       //console.log(res);
                       break;
                   }
                }
                
              }
           }
         }
        
        callback(res);
      }
      else
      {
        callback(doc);
      }
      
     }
     catch(err)
     {
       if(err)
         console.log(err);
     }
     });
   
}
mongodriver.prototype.searchword =function(needle, callback, batch)
{
   var res = Array();
   var ids = Array();
  // var itter = 0;
   var obj = this;
  
   if(needle !== undefined)
   {
   this.findall(function(doc, count,itter){
     try{
      
      for(var indx in doc)
      {
         
         if(typeof doc[indx] === 'string')
           {
              if(doc[indx].toLowerCase().match(new RegExp(needle.toLowerCase()),"i") !==null)
              {
                
            
                if(batch)
                {
                if(ids.lastIndexOf(doc['_id']) === -1)
                   {
                      
                     // console.log((doc[indx].search(new RegExp(needle,"i"))),doc[indx]);
                       res.push(doc);
                       ids.push(doc['_id']);
                       //console.log(res);
                       break;
                   }
                }
                else
                {
                  
                  callback(doc);
                  break;
                }
              }
           }
        
      }
    
      if(batch && itter === count)
      {
         
         callback(res);
      }
     }
     catch(err)
     {
       if(err)
         console.log(err);
     }
   },false);
   }
   else{
    this.findall(callback, true)
   }
}
mongodriver.prototype.findAndUpdateByID  =function(lookup, obj,callback)
{
  var res = {};
  var modobj = this;
  res.success=true;
   this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
     {
      console.log(err);
      res.success=false;
      res.error = err;
      simple.global.logerror(err);
     }
     else{
    try{
    
     var collection = db.collection(modobj.modelname);
   
     collection.findAndModify(
       {_id:lookup},
       [['_id','asc']],
       {$set:obj},
       {new:true},
       function(err, object){
         try{
           
           callback(object.value, res);
         }
         catch(error)
         {
           console.log(error);
           res.success=false;
           res.error = err;
         }
         
         }
     );
     // console.log(ret.seq);
     
    }
    catch(err){
      console.log(err);
      res.success=false;
      res.error = err;
    }
    }
  });
}

mongodriver.prototype.findAndUpdate  =function(lookup, obj,callback)
{
  var res = {};
  var modobj = this;
  res.success=true;
   this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
     {
      console.log(err);
      res.success=false;
      res.error = err;
      simple.global.logerror(err);
     }
     else{
    try{
    
     var collection = db.collection(modobj.modelname);
   
     collection.findAndModify(
       lookup,
       [['_id','asc']],
       {$set:obj},
       {new:true},
       function(err, object){
         try{
           
           callback(object.value, res);
         }
         catch(error)
         {
           console.log(error);
           res.success=false;
           res.error = err;
         }
         
         }
     );
     // console.log(ret.seq);
     
    }
    catch(err){
      console.log(err);
      res.success=false;
      res.error = err;
    }
    }
  });
}

mongodriver.prototype.generateNextSequence = function(lookup, callback)
{
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
     {
      console.log(err);
      simple.global.logerror(err);
     }
     else{
    try{

     var collection = db.collection('counters');
     collection.findAndModify(
       
       {_id:lookup},
       [['_id','asc']],
       {$inc:{seq:1}},
       {new:true},
       function(err, object){
         try{
           if(err)
            console.log(err);
            else
             {
              callback(object.value.seq);
             }
         }
         catch(error)
         {
           console.log(error);
         }
         
         }
     );
     // console.log(ret.seq);
     
    }
    catch(err){
      console.log(err);
    }
    }
  });
}

mongodriver.prototype.insertcounters=function(counterid)
{
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    
    if(err)
    {
     simple.global.logerror(err);
     console.log(err);
    }
    else
    {
     var collection = db.collection('counters');
       collection.insert({_id:counterid, seq:0}); 
    }
    } 
  );
  
}
mongodriver.prototype.getMappedObject = function(obj)
{
   var temp = {};
   for(var key in obj)
   {
      temp.key = o= obj[key];
      
   }
   return temp;
}
 



module.exports =  mongodriver;