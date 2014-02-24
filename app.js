/**
 * InfraNodus is a lightweight interface to graph databases.
 *
 * Inspired from ThisIsLike.Com and KnowNodes (now Rhizi) we
 * want to create a basic interface for rich edge annotation of graphs
 * for collaborative use.
 *
 * This open source, free software is available under MIT license.
 * It is provided as is, with no guarantees and no liabilities.
 *
 * You are very welcome to reuse this code if you keep this notice.
 *
 * Written by Dmitry Paranyushkin | Nodus Labs and hopefully you also...
 * www.noduslabs.com | info AT noduslabs DOT com
 *
 *
 * In some parts the code from the book "Node.js in Action" is used,
 * (c) 2014 Manning Publications Co.
 * by Marc Harter, T.J. Holowaychuk, Nathan Rajlich
 * Any source code files provided as a supplement to the book are freely
 * available to the public for download. Reuse of the code is permitted,
 * in whole or in part, including the creation of derivative works, provided
 * that you acknowledge that you are using it and identify the source:
 * title, publisher and year.
 */

var api = require('./routes/api');
var express = require('express');
var routes = require('./routes');
var entries = require('./routes/entries');
var Entry = require('./lib/entry');
var page = require('./lib/middleware/page');
var validate = require('./lib/middleware/validate');
var user = require('./lib/middleware/user');
var register = require('./routes/register');
var login = require('./routes/login');
var messages = require('./lib/messages');
var http = require('http');
var path = require('path');
var leap = require('./routes/leap');

var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
// This makes sure that when someone accesses /api they are authenticated first
app.use('/api', api.auth);
app.use(user);
app.use(messages);
app.use(app.router);
app.use(app.router);
app.use(routes.notfound);
app.use(routes.error);
app.use(routes.badrequest);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/post', entries.form);
app.post(
    '/post',
    validate.isLoggedIn(),
    validate.required('entry[body]'),
    validate.lengthAbove('entry[body]', 4),
    validate.sanitize('entry[body]'),
    validate.getHashtags('entry[body]'),
    validate.getContext('entry[body]'),
    entries.submit
);

app.get('/leap', leap.render);
app.get('/api/user/nodes', api.nodes);
app.get('/api/user/statements', api.entries);
app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/', entries.list);



if (process.env.ERROR_ROUTE) {
    app.get('/dev/error', function(req, res, next){
        var err = new Error('database connection failed');
        err.type = 'database';
        next(err);
    });
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});