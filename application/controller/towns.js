towns={
regxpfind:function(needle)
{
    var tmodel = this.loadmodel('towns');
    
    tmodel.findByRegex(needle,(res)=>towns.jsonResp(res));
}
}
module.exports =towns;