var towns = 
{
    modelname :'towns',
findByRegex:function(needle, callback)
{
  needle =  this.checkanddecode(needle);
   var regexp = '^'+needle+'\\s*';
   
   var regex = new RegExp(regexp,'i');
  // console.log(regex);
   this.find({name:{$regex:regex}}, {}, {},true,(doc)=>{
       if(doc.length == undefined)
        doc=[];
       callback(doc)}); 
},
addone:function(town,country,callback)
{
    var nameid = town.replace(/\s/g, '');
    var nameid = nameid.toLowerCase();
    console.log(nameid);
    this.findOne({nameid:nameid},{},{},(doc)=>{
       if(doc === null)
       {
           
           this.insert({nameid:nameid,name:town, country:country}, (tdoc)=>{
               tdoc.nameid=nameid,
               tdoc.name =town;
               callback(tdoc);
           });
       } 
       else(callback(doc));
    });
}
}
module.exports = towns;