var fs = require('fs')
  , phantom = require('phantom')
  , im = require('imagemagick')
  , crypto = require('crypto')

module.exports = function(url, options, cb){

  var url_sha = crypto.createHash('sha1').update(url).digest('hex')
  var opts_sha = crypto.createHash('sha1').update(new Buffer(options)).digest('hex')
  var img = 'cache/'+ url_sha +'/'+ opts_sha +'.jpg'

  if(fs.existsSync(img)) {
    // Istnieje miniaturka wygenerowana z dokładnie takich samych
    // parametrów.
    fs.readFile(img, 'binary', cb)
  } else {
    phantom.create(function(ph){
      ph.createPage(function(page){
        page.set('viewportSize', {width:1024,height:800})
        page.open(url, function(status){
          var tmp = '/tmp/'+ Math.random() +'.jpg'
          page.render(tmp, function(){
            im.resize({
              srcPath: tmp,
              width: 300
            }, function(err, stream){
              cb(err, stream)
              fs.mkdir('cache/'+ url_sha, function(){
                fs.writeFile(img, stream, 'binary')
              })
            })
            ph.exit()
          })
        })
      })
    })
  }
}
