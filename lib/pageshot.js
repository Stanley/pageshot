var fs = require('fs')
  , phantom = require('phantom')
  , im = require('imagemagick')
  , crypto = require('crypto')
  , _ = require('underscore')

module.exports = function(url, opts, cb){

  var options = {}
      options.resize = _.defaults(opts.resize || {}, { width: 300 })
      options.crop = _.defaults(opts.crop || {}, options.resize)
  var url_sha = crypto.createHash('sha1').update(url).digest('hex')
  var opts_sha = crypto.createHash('sha1').update(JSON.stringify(options)).digest('hex')
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
            var ch = options.crop.height
            var rh = options.resize.height
            var args = [tmp, 
                        '-thumbnail', options.resize.width + (rh ? 'x'+rh : ''),
                        '-crop', options.crop.width + (ch ? 'x'+ch : ''),
                        '-'] // write to stdout
            im.convert(args, function(err, stream){
              cb(err, stream)
              // Cache response
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
