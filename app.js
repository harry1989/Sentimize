var express = require('express'),
    routes = require('./routes'),
    content = require('./routes/content'),
    snapshot = require('./routes/snapshot'),
    stocks = require('./routes/stocks'),
    swig = require('swig'),
    path = require('path');

var app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('view cache', false);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    swig.setDefaults({
        cache: false
    });
}

// Main UI routes
app.get('/', routes.index);
app.get('/stocks/add', stocks.index);
app.get('/snapshot/:symbol', snapshot.index);

// API Endpoints
app.get('/api', routes.api);
app.get('/api/overview', routes.overview);
app.get('/api/snapshot/:symbol', snapshot.snapshot);
app.get('/api/sentiments/:symbol', content.sentiments);
app.get('/api/quotes/:symbol', content.quotes);
app.get('/api/currentprice/:symbol', content.currentPrice);
app.get('/api/content/:symbol', content.fool);
app.get('/api/trending/', content.trendingSymbols);
app.get('/api/tweets/:symbol', content.tweets);
app.get('/api/tweetwordcount/:symbol', content.tweetWordCount);
app.get('/api/capsratings/:symbol', content.capsRatings);

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Express server listening on port ' + app.get('port'));
});
