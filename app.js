var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	sass = require('node-sass-middleware'),
	autoprefixer = require('express-autoprefixer');

var app = express();

// mongo
var mongoose = require('mongoose')

mongoose.connect(process.env.MONGOHQ_URL, function(err) {
	if (err) {
		throw err;
	}
});

// sass
app.use(sass({
	src: path.join(__dirname, 'public'),
	outputStyle: 'compressed'
}));
app.use(autoprefixer({
	browsers: 'last 2 versions',
	cascade: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// auth
var auth = require('./prodo/auth');

// routes
var routes = require('./routes/index'),
	dashboard = require('./routes/dashboard'),
	messages = require('./routes/messages'),
	devices = require('./routes/devices'),
	users = require('./routes/users'),
	api = require('./routes/api');

app.use('/', routes);
app.use('/dashboard', auth.authenticated, dashboard);
app.use('/messages', auth.authenticated, messages);
app.use('/devices', auth.authenticated, devices);
app.use('/users', auth.authenticated, users);
app.use('/api', auth.deviceAuthenticated, api);

// catch 404 and forward to error handler
app.use(auth.authenticated, function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;

	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(auth.authenticated, function(err, req, res, next) {
		res.status(err.status || 500);

		if (req.get('content-type') === 'application/json') {
			res.send({
				error: err.message
			});
		} else {
			res.render('error', {
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(auth.authenticated, function(err, req, res, next) {
	res.status(err.status || 500);

	if (req.get('content-type') === 'application/json') {
		res.send({
			error: err.message
		});
	} else {
		res.render('error', {
			message: err.message,
			error: {}
		});
	}
});

module.exports = app;
