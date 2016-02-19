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
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// auth
var auth = require('./prodo/auth');

// routes
var routes = require('./routes/index'),
	dashboard = require('./routes/dashboard'),
	users = require('./routes/users');

app.use('/', routes);
app.use('/dashboard', auth.authenticated, dashboard);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');

	err.status = 404;

	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);

		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);

	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
