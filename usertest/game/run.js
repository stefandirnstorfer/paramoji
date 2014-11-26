var http = require('http');
var https = require('https');
var fs = require('fs');
var url= require('url');
var crypto= require('crypto');

var server= http.createServer(handleRequest);
server.listen(9009);

// mime types
var mimes= {
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    jpg: 'image/jpeg',
    png: 'image/png',
    ico: 'image/ico',
    svg: 'image/svg+xml',
}

// Run web server
function handleRequest(req, res) {
    try {
	var urlParts = url.parse(req.url, true);
	if (urlParts.pathname=="/submit") {
	    console.log('received post message');
	    if (req.method=='POST') {
		(function() {
		    var buf= '{"time":"'+timeStamp()+'","history":';
		    req.on('data', function(chunk) {buf+=chunk;} );
		    req.on('end', function() { 
			console.log('received '+buf);
			writeData('data.json', buf+'}\n'); 
			res.end();
		    });
		})();
	    } else
		denyAccess(res, 'Expecting POST message');
	} else {
	    if (urlParts.pathname=='/') {
		serveFile(res, 'play.html');
	    } else {
		serveFile(res, urlParts.pathname.replace(/^\/*/,''));
	    }
	}
    } catch (err) {
	console.log("error occured : "+err);
    }
}

function redirectAction(res, data) {
    data.time = timeStamp();
    res.writeHead(303, {"Location" : "/?MW_ID="+data.MW_ID+
			'&CAMP_ID='+data.CAMP_ID});
    res.end();
}

function serveFile(res, filename, content) {
    var mime= mimes[filename.replace(/[^.]*\./g,'')];
    if (!mime) {
	denyAccess(res, "Access denied");
	return;
    }
    fs.readFile(filename, function(err, data) {
	if (data) {
	    if (content) {
		data= data.toString();
		for (var key in content) {
		    data= data.replace(new RegExp('{{'+key+'}}','g'), content[key]);
		}
	    }
	    res.writeHead(200, { 
		'Content-Type': mime,
	    });
	    res.end(data)
	} else {
	    res.writeHead(404, { 'Content-Type': 'text/plain' });
	    res.end('File does not exist.');
	}
    });
}

function denyAccess(res, message) {
    console.log(message);
    res.writeHead(406, { 'Content-Type': 'text/plain' });
    res.end(message);
}

function timeStamp() {
    var pad= function(x) {
	return x<10 ? '0'+x : ''+x;
    };
    var now= new Date();
    return now.getFullYear()+'-'+
	pad(now.getMonth()+1)+'-'+
	pad(now.getDate())+'T'+
	pad(now.getHours())+':'+
	pad(now.getMinutes())+':'+
	pad(now.getSeconds());
};

function getVCode(campaign, worker) {
    var secret_key = "d1bc28bec2c909e1c8160bf50d46ead1aaccece1a67298885a47a4d3d130de46";
    var shasum = crypto.createHash('sha256');
    shasum.update(campaign + worker + secret_key);
    return 'mw-'+shasum.digest('hex').replace(/(.{10})/g,'$1<wbr/>');
}

function writeData(file, data) {
    fs.open(file, 'a', function( e, id ) {
	fs.write( id, data, null, 'utf8', function(){
	    fs.close(id, function(){
	    });
	});
    });
}
