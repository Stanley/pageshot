var pageshot = require('./lib/pageshot')
var app = require('express').createServer()

app.get('/', function(req, res){
  var url = req.query.url
  delete req.query.url

  pageshot(url, req.query, function(err, data){
    if (err) throw err
    res.contentType('image/jpeg')
    res.send(new Buffer(data, 'binary'))
  })
});

app.listen(3000);
