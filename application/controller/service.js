var simple = require('simple');
var service = new simple.simplecontroler();
service.regxpfind=function(needle)
{
    var smodel = this.loadmodel('service');
    
    smodel.findByRegex(needle,(res)=>service.jsonResp(res));
}
module.exports =service;