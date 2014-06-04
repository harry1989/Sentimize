var _ = require('underscore'),
  async = require('async'),
  loadSentiments = require('../util/psychsignal'),
  loadCapsRatings = require('../util/caps'),
  loadCurrentPrice = require('../util/quotes').get_current_price,
  loadTrendingSymbols = require('../util/stocktwits').get_trending_symbol;

var myStocks = ['MSFT', 'AAPL', 'NFLX', 'SBUX', 'GOOG', 'KOL'];


exports.index = function(req, res) {
  async.parallel({
    model : function(callback){
      fetchMarketData(myStocks, callback);
    },
    overview : function(callback){
      marketOverview(callback);
    }
  }, 
  function(err, data){
      var final_data = _.extend({
         stocks: _.sortBy(data.model, 'sentimetric').reverse()
      }, data.overview);

      console.log(final_data);

      res.render('index', final_data);
  });
}

/**
 * To serve for the API
 * 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.overview = function(req, res) {
  async.parallel({
    model : function(callback){
      fetchMarketData(myStocks, callback);
    },
    overview : function(callback){
      marketOverview(callback);
    }
  }, 
  function(err, data){
      var final_data = _.extend({
         stocks: data.model
      }, data.overview);

      console.log(final_data);

      res.json(final_data);
  });
}

/**
 * Fetches the tredning stocks and the 
 * general market sentiments
 * 
 */
function marketOverview(cb){
  async.parallel({
      symbols: function(callback) {
        loadTrendingSymbols(callback);
      },

      marketSentiments: function(callback) {
        loadSentiments('Market', '2013-10-01', '2013-11-31', function(err, sentiments) {
          callback(null, {
            "bullish": _.last(sentiments.bullish).value,
            "bearish": _.last(sentiments.bearish).value,
          });
        });
      }

    }, function(err, results) {
        cb(err, results);
    });
}

/**
 * Fetches the different data needed for each stock
 */

function fetchMarketData(stocks, callback){

  async.concat(stocks, get_data, function(err, results) {

    var rows = [];

    results.forEach(function(result) {

        var idea_count = Math.floor((Math.random() * 30) + 1);

        var sentimetric = (Math.random() * 9) + 1;
        var real_sentimetric = sentimetric.toFixed(2);

        var caps_star_count = parseInt(10, result.capsRatings);
        var non_caps_star_count = 5 - caps_star_count;

        var lastBear = _.last(result.sentiments.bearish) || {} ,
            lastBull = _.last(result.sentiments.bullish) || {};

        var row = {
          "symbol": result.symbol,
          "idea_num": idea_count,
          "sentimetric": real_sentimetric,
          "price": result.price,
          "cap_stars": caps_star_count,
          "non_cap_stars": non_caps_star_count,
          "bullish": lastBull.value,
          "bearish": lastBear.value,
        };

        rows.push(row);

    }); // <- End of forEach block
  
    callback(null, rows);
  });

}

  /**
   * Fetches all the data needed to different symbols
   */

  function get_data(symbol, callback) {
    console.log("Get data for =>" + symbol);

    async.parallel({

      symbol: function(callback) {
        callback(null, symbol);
      },

      sentiments: function(callback) {
        loadSentiments(symbol, '2013-10-01', '2013-11-31', callback);
      },

      price: function(callback) {
        loadCurrentPrice(symbol, callback);
      },

      capsRatings: function(callback) {
        loadCapsRatings(symbol, callback);
      }
    }, 

    function(err, results) {
      callback(null, results);
    });

}


/**
 * Prints all the routes available
 */


exports.api = function(req, res){ 
  var Table = require('cli-table'),
      table = new Table({head: ["", "Name", "Path"]});
      routes = req.app.routes,
      resultJSON = {};

    if(routes.get)
    {
      resultJSON['GET'] = [];
      for (var i = 0; i < routes.get.length; i++)
      {
          var route = routes.get[i],
              path = route.path,
              method = route.method;

            console.log(route.callbacks[0].name);

           table.push(["get", path, method]);
           resultJSON['GET'].push(["GET", path]);
      }  
    }
    
    if(routes.post)
    {
      resultJSON['POST'] = [];
      for (var i = 0; i < routes.post.length; i++)
      {
          var route = routes.post[i],
              path = route.path,
              method = route.method;

            console.log(route.callbacks[0].name);

           table.push(["post", path, method]);
           resultJSON['POST'].push(["POST", path]);
      }
    }

    console.log(table.toString());
    
    res.json(resultJSON);
};