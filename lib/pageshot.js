var fs = require('fs')
var phantom = require('phantom')
var im = require('imagemagick')

module.exports = function(url, cb){
  phantom.create(function(ph){
    console.log(ph)
    ph.createPage(function(page){
      page.set('viewportSize', {width:1024,height:800})
      page.open(url, function(status){
        console.log(status)
        page.render('page.jpg', function(){
          im.resize({
            srcPath: 'page.jpg',
            width: 300
          }, cb)
          ph.exit()
        })
      })
    })
  })
}
