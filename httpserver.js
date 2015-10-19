/**
 * Created by Yuchi on 2015/10/17.
 */

//require('shelljs/global');
var http = require("http");
var path = require("path");
var fs = require("fs");
var child_process = require('child_process');
var argv = require("minimist")(process.argv.slice(2), {"boolean":["h", "m", "d"]});

function isnumber(o) {
    return typeof o == "number";
}

function isstring(o) {
    return typeof o == "string";
}

function isAccess(path, access) {
    try {
        fs.accessSync(path, access);
        console.log(path + " --- ok.");
        return true;
    } catch (o) {
        console.warn(path + " --- can't access.");
        return false;
    }
}

if (argv.h) {
    console.log("" +
            "Usage: node httpserver.js [options] [file_paths]\n" +
            "       node httpserver.js -p 8000 ~/*\n" +
            "Options:\n" +
            "   -h         Help\n" +
            "   -s port    Default port number is 8000\n" +
            "   -m         Enable md5sum, show in web page\n" +
            "   -d         Last modified date\n"
    );
    process.exit();
}

var files = argv._.map(function (val) {
    try {
        return fs.realpathSync(val); //path.normalize(val);
    } catch (o) {
        return val;
    }
}).filter(function (val) {
    return isAccess(val, fs.R_OK);
});

var mapfiles = {};
files.forEach(function (val) {
    mapfiles[path.basename(val)] = val;
});

port = isnumber(argv.p)?argv.p:8000;

http.createServer(function (request, response) {
    var params = require("url").parse(request.url);
    var pathname = params.pathname;
    var isfolder;
    var filenotfound = false;
    var body;
    var contentType = "text/plain";


    var dirs = pathname.split('/').filter(function(val) { return val!=''; });

    if (dirs.length == 0) {
        // root folder
        isfolder = true;

        body = "<html><body>";
        for(var k in mapfiles) {
            var sta = fs.statSync(mapfiles[k]);
            var md5sum = "";
            var file_date = "";
            if (argv.m && !sta.isDirectory()) {
                md5sum = "&nbsp(" + child_process.execSync("md5sum " + mapfiles[k]).toString().split(" ")[0] + ")";
            }
            if (argv.d) {
                file_date = "&nbsp" + sta.mtime;
            }
            body += "<a href='/" + k + "'>" + k + "</a>" + file_date + md5sum + "<p>";
        }
        body += "</body></html>";
        contentType = "text/html";
    } else {
        //console.log(dirs);

        if (dirs[0] in mapfiles) {
            var file_segs = dirs.slice(1);
            file_segs.unshift(mapfiles[dirs[0]]);
            var access_path = path.join.apply(path, file_segs);

            try {
                access_path = fs.realpathSync(val); //path.normalize(val);
            } catch (o) {
                //
            }

            if (isAccess(access_path, fs.R_OK)) {

                var sta = fs.statSync(access_path);

                if (sta.isDirectory()) {
                    //console.log("access_path:" + access_path);
                    var morefiles = fs.readdirSync(access_path);

                    body = "<html><body>";
                    morefiles.forEach(function (v) {
                        var access_file = path.join(access_path, v);
                        if (!isAccess(access_file, fs.R_OK)) return;
                        var md5sum = "";
                        var file_date = "";
                        var sta = fs.statSync(access_file);
                        if (argv.m && !sta.isDirectory()) {
                            md5sum = "&nbsp(" + child_process.execSync("md5sum " + access_file).toString().split(" ")[0] + ")";
                        }
                        if (argv.d) {
                            file_date = "&nbsp" + sta.mtime;
                        }
                        body += "<a href='/" + dirs.concat(v).join("/") + "'>" + v + "</a>" + file_date + md5sum + "<p>";
                    });
                    body += "</body></html>";
                    contentType = "text/html";

                } else {
                    // single file
                    response.writeHead(200, {
                        'Content-Type': "application/octet-stream",
                        'Content-Length': sta.size
                    });

                    var readStream = fs.createReadStream(access_path);
                    readStream.pipe(response);

                    console.log("Download file: " + access_path);

                    return;
                }
            } else {
                filenotfound = true;
                body = "File can't access" + dirs;
            }

        } else {
            filenotfound = true;
            body = "File not found";
        }

    }

    response.writeHead(filenotfound?404:200, {
        'Content-Length': body.length,
        'Content-Type': contentType });

    response.end(body);

}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + "/");
