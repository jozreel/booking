var simple = require('simple');
var errlog = simple.config.logpath+'/error.log'
var fs = require('fs');
var global = function(){}
global.logerror= function(err)
{
	var date = new Date();
	var str =date.toISOString();
	console.log(errlog);
	if(typeof err === 'object')
	{
		if(err.message)
		{
			var msg = "\r\n"+str +'\r\n'+err.message +'\r\n';
			fs.appendFile(errlog, msg,{'flags':'a'}, function(err)
			{
				if(err)
				{
					console.log(err);
					
				}
				else{
					console.log('error written to log');
				}
			});
		}
		if(err.stack)
		{
		  var msgs = "\r\n"+str +'\r\n'+err.stack+'\r\n';
			fs.appendFile(errlog,msgs, function(err)
			{
				if(err)
				{
					console.log(err);
					
				}
				else{
					console.log('stack trace written to log');
				}
			});
		}
	}
}

module.exports = global;