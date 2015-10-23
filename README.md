# SimpleHttpServerJS

SimpleHttpServerJS is a simple http server, sometimes you need a simple http server to export some files in different folders, you can use this to do that.

### Version
0.1.0

### Tech

SimpleHttpServerJS uses a number of open source projects to work properly:

* [node.js] - Let javascript run on server side. (v0.12 and v4.21 later)
* [minimist] - Help to parse program arguments.

### Installation and Run

```sh
$ git clone [git-repo-url] SimpleHttpServerJS
$ cd SimpleHttpServerJS
$ npm install minimist
$ node httpserver.js -p 8000 file_path_1 file_path_2 [... more files or folders]
```

Then, open browser and type "http://hostname:8000/" to browse files and folders.
File paths combination describes in following section.

### File paths combination

1. Only one root, just like a normal web server, server lists
all files in the folder.
```sh
$ node httpserver.js -p 8000 /root/folder/*
```

2. Multiple roots, server lists all files in all folders,
just like all files are in the same folder.
```sh
$ node httpserver.js -p 8000 /root/folder1/* /root/folder2/*
```

3. Multiple folders, server lists all folder names.
In following example, the name folder1, folder2 will be listed.
```sh
$ node httpserver.js -p 8000 /root/folder1 /root/folder2
```

4. More and more
```sh
$ node httpserver.js -p 8000 /root/folder1/*/*.html /root/folder2/*.jpg \
 /root/folder3/index.html
```

### Usage
```sh
$ node httpserver.js -h
Usage: node httpserver.js [options] [file_paths]
       node httpserver.js -p 8000 ~/*
Options:
   -h         Help
   -s port    Default port number is 8000
   -m         Enable md5sum, show in web page
   -d         Last modified date, show in web page
```

### Todo's

* UTF-8
* Correct content type
* File list appearance

License
---

MIT


