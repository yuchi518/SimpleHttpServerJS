# SimpleHttpServerJS

SimpleHttpServerJS is a simple http server, sometimes you need a simple http server to export some files in different folders, you can use this to do that.

### Version
0.1.0

### Tech

SimpleHttpServerJS uses a number of open source projects to work properly:

* [node.js] - Let javascript run on server side.
* [minimist] - Help to parse program arguments.

### Installation & Run

```sh
$ git clone [git-repo-url] SimpleHttpServerJS
$ cd SimpleHttpServerJS
$ npm install minimist
$ node httpserver.js -p 8000 file_path_1 file_path_2 [... more files or folders]
```

Then, open browser and type "http://hostname:8000/" to browse files and folders.


### Todo's

* UTF8

License
---

MIT


