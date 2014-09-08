var http = require('http');
var https = require('https');
var fs = require('fs');
var url= require('url');
var crypto= require('crypto');
var emoticon= require('./emoticon.js');

var server= http.createServer(handleRequest);
server.listen(9009);

// mime types
var mimes= {
    html: 'text/html',
    css: 'text/css',
    jpg: 'image/jpeg',
    png: 'image/png',
    ico: 'image/ico',
    svg: 'image/svg+xml',
}

var workById = {};

// Run web server
function handleRequest(req, res) {
    try {
	var urlParts = url.parse(req.url, true);
	var worker = urlParts.query.MW_ID;
	var campaign = urlParts.query.CAMP_ID;
	var workerInfo = workById[worker];
	if (!workerInfo) {
	    workerInfo = {
		tasks : 0,
		training : 0,
		success : 0,
		active : false
	    };
	    workById[worker]= workerInfo;
	}

	if (!worker && !urlParts.pathname.match(/\./)) {
	    denyAccess(res, "Worker ID is missing");
	}
	else if (urlParts.pathname=="/") {
	    if (!workerInfo.active) {
		if (workerInfo.training < 3) {
		    workerInfo.ref = Math.floor(Math.random()*2); 
		    var content = {
			"worker" : worker,
			"campaign" : campaign,
		    }
		    serveFile(res, "pages/training_"+(workerInfo.training+1)+".html", content);
		}
		else if (workerInfo.success < 3) {
		    delete workById[worker];
		    serveFile(res, "pages/sorry.html", content);
		}
		else {
		    workerInfo.active = true;
		    serveFile(res, "pages/activate.html", content);
		}
	    }
	    else {
		if (workerInfo.tasks < 10) {
		    var content = {
			"work" : workerInfo.tasks + 1,
			"worker" : worker,
			"campaign" : campaign,
			"valence" : Math.floor(Math.random()*3)/2,
			"arousal" : Math.floor(Math.random()*3)/2,
			"potency" : .5 //Math.floor(Math.random()*3)/2,
		    }
		    serveFile(res, "pages/query.html", content);
		} else {
		    var content = {
			"CODE" : getVCode(campaign, worker)
		    };
		    serveFile(res, "pages/thankyou.html", content);
		}
	    }
	} 
	else if (urlParts.pathname=="/submit") {
	    redirectAction(res, urlParts.query);
	    workerInfo.training += 1;
	    var success = true;
	    for (var key in urlParts.query) {
		if (key.match(/test$/)) {
		    success = success && urlParts.query[key]==1
		}
	    }
	    if (success)
		workerInfo.success += 1;
	    writeData('data/training.json', JSON.stringify(urlParts.query)+'\n');
	} 
	else if (urlParts.pathname=="/submit2") {
	    redirectAction(res, urlParts.query);
	    writeData('data/data.json', JSON.stringify(urlParts.query)+'\n');
	    workerInfo.tasks += 1;
	}
	else if (urlParts.pathname=="/face.svg") {
	    var v = urlParts.query.v;
	    var a = urlParts.query.a;
	    var p = urlParts.query.p;
	    res.writeHead(200, { 
		'Content-Type': mimes.svg,
	    });
	    var svgbody = emoticon.emoticon_svg_raw(100*v, 100*a, 100*p);
	    res.end(svgbody)
	}
	else {
	    serveFile(res, 'pages' + urlParts.pathname);
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
