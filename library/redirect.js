
var redirect = function(req, res)
{

	this.res = res;
	
}
redirect.prototype.redirect =function(locate)
{
	console.log(locate);
	this.res.writeHead(302, {'Location': locate});
    this.res.end();
}
redirect.prototype.get = function(host)
{
var rd = this;
 var data;
var http=require('http')
console.log(host);
http.get(host, function(res) {
	res.on('data', function(d){data +=d;});
	res.on('end', function () {rd.res.end(data)});
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
}
module.exports = redirect;