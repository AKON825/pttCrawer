module.exports = router;

var path = require('path');
var async = require('async')
var request = require('request')
var cheerio = require('cheerio')
var db = require('../model')
var config = require(path.join(__root_dir, '/config/parameters'))

function router (app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    var pttUrl = 'https://www.ptt.cc'
    var count = 0
    var pageLinkList = []

    pageLinkList.push('/bbs/cat/index.html')

    async.waterfall([
      function(asyncCb) {
        getPageUrlList('/bbs/cat/index.html', asyncCb)
      },
      function(arg1, asyncCb) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        getPageUrlList(arg1, asyncCb)
      },
      function(arg1, asyncCb) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        getPageUrlList(arg1, asyncCb)
      },
      function(arg1, asyncCb) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        getPageUrlList(arg1, asyncCb)
      },
      function(arg1, asyncCb) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        getPageUrlList(arg1, asyncCb)
      }
    ], function (err, result) {
      if (err) {
        console.log(err.message)
      }

      console.log(pageLinkList)

      return getArticleHrefList(pageLinkList, function (articleHrefList) {
        console.log('共', articleHrefList.length, '筆')
        async.eachLimit(articleHrefList, 4,function(href, asyncCb) {
          //count = count + 1
          //console.log(count)
          return getArticle(href, function(err){
            if (err) {
              console.log('A page failed to process');
              asyncCb(err)
            }

            return asyncCb()
          })
        }, function(err){
          if( err ) {
            console.log('A page failed to process');
          }

          return res.send('done' + count)
        });
      })
    });

    function getPageUrlList (pageUrl, cb) {
      return request(pttUrl + pageUrl, function (error, response, body) {
        if(error) {
          console.log(err.message)
        }

        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body)
          var preLink = $('.btn-group.pull-right a').eq(1).attr('href')

          pageLinkList.push(preLink)

          return cb(null, preLink)
        }
      })
    }

    function getArticleHrefList (pageLinkList, cb) {
      var articleHrefList = []

      async.each(pageLinkList, function(pageLink, asyncCb) {
        return request(pttUrl + pageLink, function (error, response, body) {
          if(error) {
            console.log(err.message)
          }

          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body)

            $('.r-list-container div.r-ent div.title a').each(function( index ) {
              var href = $(this).attr('href')

              articleHrefList.push(href)
            });

            asyncCb()
          }
        })
      }, function(err){
        if( err ) {
          console.log('A page failed to process');
        }

        console.log(articleHrefList)
        return cb(articleHrefList)
      });
    }

    function getArticle(href, cb) {
      return request(pttUrl + href, function (error, response, body) {
        if(error) {
          console.log(err.message)
        }

        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body)
          var mainContent = $('#main-content')

          mainContent.find('article-metaline')

          var author = mainContent.find('span.article-meta-value').eq(0).text()
          var title = mainContent.find('span.article-meta-value').eq(2).text()
          mainContent.children().remove()
          var content = mainContent.text()

          //console.log(author, title, content)
          var author = $('span.article-meta-value').text()
          count = count + 1
          console.log('已完成', count)
          new db.Article({author: author, title: title, content: content})
            .save(null, { method: 'insert' })
            .asCallback(function (err, result) {
              if (err) {
                console.log('A page failed to processssssssssssssssssssssssssssssss');
                return cb(err.message)
              }

              //count = count + 1
              //console.log('已完成', count)
              cb()
            })
        }
      })
    }
  });
}