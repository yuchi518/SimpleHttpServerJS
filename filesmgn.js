/**
 * Created by Yuchi on 2015/11/7.
 */
var fs = require("fs");
var path = require("path");

function FilesMgn(root_files, index_files) {
    this.ori_root_files = root_files;
    this.index_files = index_files;
    this.root_files = [];
    this.root_files_map = {};
    this.scan_root_files();
};

FilesMgn.prototype.scan_root_files = function () {
    var that = this;
    this.root_files = this.ori_root_files.map(function (val) {
        try {
            return fs.realpathSync(val); //path.normalize(val);
        } catch (o) {
            return val;
        }
    }).filter(function (val) {
        return that.is_accessible(val, fs.R_OK);
    });

    var mapfiles = {};
    this.root_files.forEach(function (val) {
        mapfiles[path.basename(val)] = val;
    });
    this.root_files_map = mapfiles;
};

FilesMgn.prototype.is_accessible = function (path, access) {
    try {
        fs.accessSync(path, access);
        console.log(path + " --- ok.");
        return true;
    } catch (o) {
        console.warn(path + " --- can't access.");
        return false;
    }
};

FilesMgn.prototype.find_url_path = function (url_path) {
    var url_segs = url_path.split('/').filter(function(val) { return val!=''; });

    if (url_segs.length == 0) {
        // root
        // find index file
        if (this.index_files.length > 0) {
            for (var i = 0; i < this.index_files.length; i++) {
                if (this.index_files[i] in this.root_files_map) {
                    var sta = fs.statSync(this.root_files_map[this.index_files[i]]);
                    if (sta.isFile()) {
                        return this.root_files_map[this.index_files[i]];
                    }
                }
            }
        }

        // files list
        return {
            base_url: "",
            files_map: this.root_files_map
        };
    } else {
        if (url_segs[0] in this.root_files_map) {
            // find the root
            var file_segs = url_segs.slice(1);
            file_segs.unshift(this.root_files_map[url_segs[0]]);
            var access_path = path.join.apply(path, file_segs);

            try {
                access_path = fs.realpathSync(val); //path.normalize(val);
            } catch (o) {
                //
            }

            if (this.is_accessible(access_path, fs.R_OK)) {
                var sta = fs.statSync(access_path);

                if (sta.isDirectory()) {
                    var files_list = fs.readdirSync(access_path);

                    // find index file
                    if (this.index_files.length > 0) {
                        for (var i = 0; i < this.index_files.length; i++) {
                            if (this.index_files[i] in files_list) {
                                var index_path = path.join(access_path, this.index_files[i]);
                                if (this.is_accessible(index_path, fs.R_OK)) {
                                    sta = fs.statSync(index_path);
                                    if (sta.isFile()) {
                                        return index_path;
                                    }
                                }
                            }
                        }
                    }

                    // files list
                    return {
                        base_url: url_path,
                        base_folder: access_path,
                        files_map: files_list,
                    }
                } else {
                    return access_path;
                }
            }
        }
    }
    return null;
};


module.exports = FilesMgn;
