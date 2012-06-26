var pageshot = require('./lib/pageshot')
var app = require('express').createServer()

app.get('/*', function(req, res){
  pageshot(req.params[0], function(err, buffer){
    res.contentType('image/jpeg')
    res.send(buffer)
  })
});

app.listen(3000);
