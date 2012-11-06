var pageshot = require('./lib/pageshot')
var app = require('express')()

app.get('/', function(req, res){
  var url = req.query.url
  delete req.query.url

  pageshot(url, req.query, function(err, data){
    if (err) {
      res.send(500, err)
    } else {
      res.contentType('image/jpeg')
      res.send(new Buffer(data, 'binary'))
    }
  })
});

app.listen(3000);
