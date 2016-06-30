var postdata = function(req, res)
{
	this.rq = req;
	this.rs=res;
	var qs = require('querystring');
	
	if(req.method==='POST')
	{
		var body = '';
		req.on('data', function(data)
		{
	     body+=data.toString();
		  if(body.length > 1e6) {
                queryData = "";
                res.writeHead(413, {'Content-Type': 'text/plain'}).end();
                req.connection.destroy();
		//console.log(body);
		}
		}
		);
		req.on('end', function() {
			
        req.postdata = qs.parse(body);
		//console.log(JSON.parse(req.postdata));
        });
	}
	
    console.log(req.postdata);
	
	
}
module.exports= postdata;