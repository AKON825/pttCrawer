# pttCrawer - A sameple for crawing data from ptt(https://www.ptt.cc) with node.js and cheerio.js

---

## Database


## Install

This demo project depends on [Node.js](http://nodejs.org/),


```sh
$ npm install
```

1.You need to install Mysql on your system first, then Create a database named 'ptt' 

2.Copy the file config/paramaters.js.example to config/paramaters.js

3.And edit the db config like the following 
```sh
  /* 資料庫 */
    database: {
      'host': '127.0.0.1',
      'name': 'ptt',
      'user': 'root',
      'password': 'pwd'
    }
```
Run migration
```sh
$ knex migrate:latest
```

##  Use
```sh
$ node app.js
```

Then request to http://localhost:3000

It will get data from ptt and save the data to mysql

## Usage

Login function work with the facebook api, if you want test this project on your machine, you need to do some settings at fackbook for developers  

You can find the tricks at  https://developers.facebook.com/docs/facebook-login/web

##  To do list

1.Let the board url arg like "/bbs/cat/index.html" can be edit and save
2.Use Backend job queue to handle the request requirement 


##  Snapshot

![Alt text](https://github.com/AKON825/pttCrawer/blob/master/public/images/snapshot.jpg?raw=true)