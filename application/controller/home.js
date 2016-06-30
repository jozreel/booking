var simple = require('simple');
var home = new simple.simplecontroler();

home.index = function()
{
	
	
	this.loadview('index');
}
home.registersuccess = function()
{
    this.loadview('success');
}

module.exports = home;
