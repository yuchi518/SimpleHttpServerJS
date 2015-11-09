# SimpleHttpServerJS / Multi-Directors Http Server (mdhs)

SimpleHttpServerJS is a simple and multiple directors http server, sometimes you need a simple http server to export some files in different folders, you can use this to do that.

### Version
0.1.5

### Tech

SimpleHttpServerJS uses a number of open source projects to work properly:

* [node.js] - Let javascript run on server side. (v0.12 and v4.21 later)
* [minimist] - Help to parse program arguments.
* [mime-types] - Help to set correct mime types.

### Installation and Run

```sh
$ npm install -g mdhs
$ mdhs -p 8000 file_path_1 file_path_2 [... more files or folders]
Server running at http://127.0.0.1:8000/
^C (exit)
```

Then, open browser and type "http://hostname:8000/" to browse files and folders.
File paths combination describes in following section.

### File paths combination

1. Only one root, just like a normal web server, server lists
all files in the folder.
```sh
$ mdhs -p 8000 /root/folder/*
```

2. Multiple roots, server lists all files in all folders,
just like all files are in the same folder.
```sh
$ mdhs -p 8000 /root/folder1/* /root/folder2/*
```

3. Multiple folders, server lists all folder names.
In following example, the name folder1, folder2 will be listed.
```sh
$ mdhs -p 8000 /root/folder1 /root/folder2
```

4. More and more
```sh
$ mdhs -p 8000 /root/folder1/*/*.html /root/folder2/*.jpg \
 /root/folder3/index.html
```

5. Show web page
```sh
$ mdhs -p 8000 -i "index.html,index.htm" /www/*
```

### Usage
```sh
$ mdhs -h
Usage: mdhs [options] [file_paths]
       mdhs -p 8000 ~/*
Options:
   -h, --help                 Help
   -p, --port port            Default port number is 8000

   -m, --md5                  Enable md5sum, show in web page
   -d, --date                 Last modified date
   -i, --index index.html     Default folder's index file name
File paths:
   At least one
```

### Todo's

* UTF-8
* File list appearance
* Roots synchronization

License (ISC)
---

Copyright (c) 2015, Yuchi <yuchi518@gmail.com>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


