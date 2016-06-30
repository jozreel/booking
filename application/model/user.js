var simple = require('simple');
var user = new simple.simplemodel();
user.modelname = 'user';

user.addUser = function(obj, callback)
{
    this.findOne({_id:obj._id},{},{},(doc)=>{
        if(doc == null)
        {
         console.log(obj);
         this.insertOrUpdate(obj,(docins)=>{
        console.log('added');
         docins.success = true;
        callback(docins);
         });
        }
        else{
            callback({success:false, message:'user already exist'});
        }
    });
   
}
user.saveUser = function(id,obj,callback)
{
    this.findAndUpdateByID(id,obj,callback);
}


module.exports = user;