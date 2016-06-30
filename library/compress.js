var compress = function(req, res)
{
	

	
	var acceptEncoding = req.headers['accept-encoding'];
     if (!acceptEncoding) {
        acceptEncoding = '';
		this.compress = false;
        }
		else{
	    this.compress = true;
		this.acceptEncoding = acceptEncoding;
		}
	
}
module.exports = compress;