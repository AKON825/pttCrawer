module.exports = router;

var path = require('path');
var async = require('async')
var request = require('request')
var config = require(path.join(__root_dir, '/config/parameters'))
var cheerio = require('cheerio')
var async = require('async')

function router (app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    var pttUrl = 'https://www.ptt.cc'

    return request(pttUrl + '/bbs/cat/index.html', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body)
        var hrefList = []

        $('.r-list-container div.r-ent div.title a').each(function( index ) {
          var href = $(this).attr('href')

          hrefList.push(href)
        });

        async.each(hrefList, function(href, asyncCb) {
          getPage(href, asyncCb)
        }, function(err){
          if( err ) {
            console.log('A page failed to process');
          }

          return res.send('done')
        });
      }
    })

    function getPage(href, cb) {
      return request(pttUrl + href, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body)
          var mainContent = $('#main-content')

          mainContent.find('article-metaline')

          var author = mainContent.find('span.article-meta-value').eq(0).text()
          var title = mainContent.find('span.article-meta-value').eq(2).text()
          mainContent.children().remove()
          var content = mainContent.text()

          console.log(author, title, content)
          var author = $('span.article-meta-value').text()

          cb()
        }
      })
    }
  });
}