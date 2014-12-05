var express        = require('express');
var bodyParser     = require('body-parser');
var morgan         = require('morgan');
var app            = express();

// var db = require('./config/db');
// mongoose.connect(db.url);

var port = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

app.listen(port);

exports = module.exports = app;
