
var businesstype ={
modelname:'businesstype',
addne:function(btype,callback)
{
    var businessid = btype.replace(/\s/g, '');
    var businessid = businessid.toLowerCase();
    //console.log(businessid);
    this.findOne({businesstypeid:businessid},{},{},(doc)=>{
       if(doc === null)
       {
           
           this.insert({businesstypeid:businessid,businesstypename:btype}, (tdoc)=>{
               tdoc.businesstypeid=businessid,
               tdoc.businesstypename =btype;
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
   this.find({businesstypename:{$regex:regex}}, {}, {},true,(doc)=>{
       if(doc.length == undefined)
        doc=[];
       callback(doc)}); 
}
}
module.exports = businesstype;
