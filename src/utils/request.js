var https = require('https');
var http = require('http');

// Wrap HTTP/HTTPS calls
module.exports = function(req,data,callback){
        if (req.host === "api.fitbit.com") {
                var r = url.parse(req.href, true);
                r.method = req.method;
                if (!r.query.oauth_token) {
                        r.headers = {
                                'Authorization': 'OAuth oauth_consumer_key="' + r.query.oauth_consumer_key + '", oauth_nonce="' + r.query.oauth_nonce + '", oauth_signature="' + encodeURIComponent(r.query.oauth_signature) + '", oauth_signature_method="' + r.query.oauth_signature_method + '", oauth_timestamp="' + r.query.oauth_timestamp + '", oauth_version="' + r.query.oauth_version + '"'
                        };
                } else {
                        r.headers = {
                                'Authorization': 'OAuth oauth_consumer_key="' + r.query.oauth_consumer_key + '", oauth_nonce="' + r.query.oauth_nonce + '", oauth_signature="' + encodeURIComponent(r.query.oauth_signature) + '", oauth_signature_method="' + r.query.oauth_signature_method + '", oauth_timestamp="' + r.query.oauth_timestamp + '", oauth_token="' + r.query.oauth_token + '", oauth_verifier="' + r.query.oauth_verifier + '", oauth_version="' + r.query.oauth_version + '"'
                        };
                }
                r.query = {};
                r.path = req.pathname;
                req = r;
        }
	var r = ( req.protocol==='https:' ? https : http ).request( req, function(res){
		var buffer = '';
		res.on('data', function(data){
			buffer += data;
		});
		res.on('end', function(){
			callback(null,res,buffer);
		});
	});
	r.on('error', function(err){
		callback(err);
	});
	if(data){
		r.write(data);
	}
	r.end();
	return r;
};
