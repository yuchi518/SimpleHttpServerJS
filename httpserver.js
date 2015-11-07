#! /usr/bin/env node
/**
 * Created by Yuchi on 2015/10/17.
 */

var http = require("http");
var path = require("path");
var mime = require('mime-types')
var fs = require("fs");
var process = require("process")
var child_process = require('child_process');
var argv = require("minimist")(process.argv.slice(2),
    {"boolean":["h", "m", "d"], "string":["i"], alias:{"help":"h", "md5":"m", "date":"d", "index":"i", "port":"p"}});
var FilesMgn = require("./filesmgn.js");


function isnumber(o) {
    return typeof o == "number";
}

function fixedEncodeURI(str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

if (argv.h || argv._.length==0) {
    console.log("" +
            "Usage: mdhs [options] [file_paths]\n" +
            "       mdhs -p 8000 ~/*\n" +
            "Options:\n" +
            "   -h, --help                 Help\n" +
            "   -p, --port port            Default port number is 8000\n" +
            "   \n" +
            "   -m, --md5                  Enable md5sum, show in web page\n" +
            "   -d, --date                 Last modified date\n" +
            "   -i, --index index.html     Default folder's index file name\n" +
            "File paths:\n" +
            "   At least one\n"
    );
    process.exit();
}

var indexs_filename = [];
if (argv.i) {
    argv.i.split(",").forEach(function (val) {
        var v = val.trim();
        if (v.length>0) indexs_filename.push(v);
    });
}

var filesmgn = new FilesMgn(argv._, indexs_filename);

port = isnumber(argv.p)?argv.p:8000;
md5sum_cmd = {
    'darwin': "md5 -r",
    'freebsd': "md5sum",
    'linux': "md5sum",
    'sunos': "md5sum",
    //'win32': "FCIV-md5-sha1",  // not sure
}[process.platform];


http.createServer(function (request, response) {
    var params = require("url").parse(request.url);
    var pathname = decodeURI(params.pathname);
    var body;
    var result = filesmgn.find_url_path(pathname);

    if (result == null) {
        body = "File not found.";
        response.writeHead(404, {
            'Content-Length': body.length,
            'Content-Type': "text/plain" });
        response.end(body);
    } else if (typeof result == "string") {
        var sta = fs.statSync(result);
        response.writeHead(200, {
            'Content-Type': mime.lookup(result) || "application/octet-stream",
            'Content-Length': sta.size
        });

        var readStream = fs.createReadStream(result);
        readStream.pipe(response);

        var date = new Date();
        console.log("[%d:%d:%d] Download file: %s", date.getHours(), date.getMinutes(), date.getSeconds(), result);
    } else if (typeof result == "object" && result.files_map != null) {
        body = "<html><body>";

        var iter_fun = function(file) {
            var file_path;
            if (result.base_folder == null) {
                file_path = result.files_map[file];
            } else {
                file_path = path.join(result.base_folder, file);
            }
            var sta = fs.statSync(file_path);
            var md5sum = "";
            var file_date = "";
            if (argv.m && !sta.isDirectory() && md5sum_cmd!=null) {
                md5sum = "&nbsp(" + child_process.execSync(md5sum_cmd + " \"" + file_path + "\"").toString().split(" ")[0] + ")";
            }
            if (argv.d) {
                file_date = "&nbsp" + sta.mtime;
            }
            body += "<a href='" + fixedEncodeURI(result.base_url + "/" + file) + "'>" + file + "</a>" + file_date + md5sum + "<p>";
        };

        if (result.base_folder == null) {
            // map
            for (var file in result.files_map) {
                iter_fun(file);
            }
        } else {
            // array
            result.files_map.forEach(iter_fun);
        }

        body += "</body></html>";
        response.writeHead(404, {
            'Content-Length': body.length,
            'Content-Type': "text/html" });
        response.end(body);
    } else {
        body = "What are you looking for?";
        response.writeHead(404, {
            'Content-Length': body.length,
            'Content-Type': "text/plain" });
        response.end(body);
    }
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + "/");
