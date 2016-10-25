var service={
regxpfind:function(needle)
{
   
    var smodel = this.loadmodel('service');
     console.log('seen');
    smodel.findByRegex(needle,(res)=>this.jsonResp(res));
}
}
module.exports =service;