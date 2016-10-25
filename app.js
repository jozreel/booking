var simple = require('simplejs');
var server = simple.apply('session', {town:'roseau', ocu:'gcc'})
	.apply('cache', {Expires:'-1', Pragma:'No-Cache'})
	.apply('compress')
	.apply('urlencode')
	.apply('redirect')
	.apply('secure')
    .use(function(req,res)
    {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    });
	
    server.listen('localhost', 1339)
	server.securelisten('localhost', 4435);
	//server.createWebSock('localhost',1338);
	
	