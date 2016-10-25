businesstype={
regxpfind:function(needle)
{
    var smodel = this.loadmodel('businesstype');
    
    smodel.findByRegex(needle,(res)=>businesstype.jsonResp(res));
}
}
module.exports =businesstype;