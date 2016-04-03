module.exports = router

var path = require('path')
var async = require('async')
var request = require('request')
var cheerio = require('cheerio')
var db = require('../model')

function router (app) {
  /* GET home page. */
  app.get('/', function (req, res, next) {
    var pttUrl = 'https://www.ptt.cc'
    var count = 0
    var pageLinkList = []

    pageLinkList.push('/bbs/cat/index.html')

    // todo : 這邊能再修改成輸入文章入來判斷要執行幾頁, 抓幾筆
    async.waterfall([
      function (asyncCb) {
        getPageUrlList('/bbs/cat/index.html', asyncCb)
      },
      function (arg1, asyncCb) {
        getPageUrlList(arg1, asyncCb)
      },
      function (arg1, asyncCb) {
        getPageUrlList(arg1, asyncCb)
      },
      function (arg1, asyncCb) {
        getPageUrlList(arg1, asyncCb)
      },
      function (arg1, asyncCb) {
        getPageUrlList(arg1, asyncCb)
      }
    ], function (err, result) {
      if (err) {
        console.log(err.message)
      }

      console.log(pageLinkList)

      return getArticleHrefList(pageLinkList, function (articleHrefList) {
        console.log('共', articleHrefList.length, '筆')

        var concurrency = 3

        async.eachLimit(articleHrefList, concurrency, function (href, asyncCb) {
          // count = count + 1
          // console.log(count)
          return getArticle(href, function (err) {
            if (err) {
              console.log('A page failed to process')
              asyncCb(err)
            }

            return asyncCb()
          })
        }, function (err) {
          if (err) {
            console.log('A page failed to process')
          }

          return res.send('done' + count)
        })
      })
    })

    function getPageUrlList (pageUrl, cb) {
      return request(pttUrl + pageUrl, function (error, response, body) {
        if (error) {
          console.log(error.message)
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

      async.each(pageLinkList, function (pageLink, asyncCb) {
        return request(pttUrl + pageLink, function (error, response, body) {
          if (error) {
            console.log(error.message)
          }

          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body)

            $('.r-list-container div.r-ent div.title a').each(function (index) {
              var href = $(this).attr('href')

              articleHrefList.push(href)
            })

            asyncCb()
          }
        })
      }, function (err) {
        if (err) {
          console.log('A page failed to process')
        }

        console.log(articleHrefList)

        return cb(articleHrefList)
      })
    }

    function getArticle (href, cb) {
      return request(pttUrl + href, function (error, response, body) {
        if (error) {
          console.log(error.message)
          return cb()
        }

        if (response.statusCode != 200) {
          // todo
          // response.statusCode 有時會非成功的200
          // 要解決重送失敗的request, 用排程管理的套件當背景自動重送會式比較好的作法
          // 或者另外使用一失敗陣列, 寫重送的邏輯
          console.log(response.statusCode, body)

          return cb()
        }

        var $ = cheerio.load(body)
        var mainContent = $('#main-content')

        mainContent.find('article-metaline')

        var author = mainContent.find('span.article-meta-value').eq(0).text()
        var title = mainContent.find('span.article-meta-value').eq(2).text()

        mainContent.children().remove()

        var content = mainContent.text()

        new db.Article({author: author, title: title, content: content})
          .save(null, { method: 'insert' })
          .asCallback(function (err, result) {
            if (err) {
              console.log('A page failed to process')
              return cb(err.message)
            }

            count = count + 1
            console.log('已存入', count, '筆文章')
            cb()
          })
      })
    }
  })
}
