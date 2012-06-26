var phantom = require('phantom')

module.exports = function(url, cb){
  phantom.create(function(ph){
    console.log(ph)
    ph.createPage(function(page){
      page.set('viewportSize', {width:1024,height:800})
      page.open(url, function(status){
        console.log(status)
        page.render('page.jpg', function(){
          ph.exit()
          cb()
        })
      })
    })
  })
}