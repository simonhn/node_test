var express = require('express'),
  path = require('path'),
  http = require('http'),
  content = require('./routes/content');

var app = express();

app.configure(function () {
  app.set('port', 3000);
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get(    '/:networkId/:airportCode/:date', content.findByProgramDate);
app.get(    '/:networkId/:airportCode/:date/:time', content.findByProgramDateTime);
app.get(    '/:id', content.findById);
app.post(   '/', content.add);
app.put(    '/:id', content.update);
app.delete( '/:id', content.remove);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'));
});
