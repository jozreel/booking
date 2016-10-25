var service ={
modelname:'service',
addnew:function(serv,callback)
{
    var nameid = serv.replace(/\s/g, '');
    var nameid = nameid.toLowerCase();
    //console.log(nameid);
    this.findOne({serviceid:nameid},{},{},(doc)=>{
       if(doc === null)
       {
           
           this.insert({serviceid:nameid,servicename:serv}, (tdoc)=>{
               tdoc.serviceid=nameid,
               tdoc.servicename =serv;
               callback(tdoc);
           });
       } 
       else(callback(doc));
    });
},
findByRegex:function(needle, callback)
{
  needle =  this.checkanddecode(needle);
   var regexp = '^'+needle+'\\s*';
   
   var regex = new RegExp(regexp,'i');
  // console.log(regex);
   this.find({servicename:{$regex:regex}}, {}, {},true,(doc)=>{
       if(doc.length == undefined)
        doc=[];
       
       callback(doc)}); 
}
}
module.exports = service;
