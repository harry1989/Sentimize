var getSentiments = require('../psychsignal'),
    getFoolContent = require('../fool'),
    getQuotes = require('../quotes').get_quotes,
    getTweets = require('../stocktwits').get_tweets,
    getTweetWordCount = require('../stocktwits').get_word_counts,
    async = require('async'),
    _ = require('underscore');

var getSnaphotData = function(req, res, snatShotcb){

    async.parallel({
        sentiments: function(cb){
            getSentiments(req.params.symbol, '2013-08-01', '2013-11-15', cb);
        },
        quotes: function(cb){
            getQuotes(req.params.symbol, '20130801', '20131115', cb);
        },
        foolcontents: function(cb){
            getFoolContent(req.params.symbol, cb);        
        },
        tweets: function(cb){
            getTweets(req.params.symbol, cb);        
        },
        tweetsCount: function(cb){
            getTweetWordCount(req.params.symbol, cb);
        }
    },

    function(err, results){
        if (err){
            return snatShotcb(err, null)
        }
        else {
            snatShotcb(null, {
                symbol: results.sentiments.symbol,
                sentiments: results.sentiments,
                quotes: results.quotes,
                foolcontents: _.map(results.foolcontents, function(article){return {Title: article.Title,  Url : article.Url}}),
                tweets: _.map(results.tweets, function(tweet){ return {body: tweet.body}}),
                tweetwordcount: results.tweetsCount
            })
        }
    });
};

exports.index = function(req, res) {
    getSnaphotData(req, res, function(err, data){
        if (err){
            consoloe.log('Error while fetching the content ' + err);
            res.send('200', 'Error while fetching the content');
        }
        else {
            res.render('snapshot', {
                data: data,
                pagename: 'NewsFeed'
            });
        }
    })
};

exports.snapshot = function(req, res) {
    getSnaphotData(req, res, function(err, data){
        if (err){
            consoloe.log('Error while fetching the content ' + err);
            res.json({'Error': 'Error while fetching the content'});
        }
        else {
            res.json(data);
        }
    })
};