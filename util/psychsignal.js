var request = require('request'),
    _ = require('underscore'),
    _s = require('underscore.string');

module.exports = function get_sentiments(symbol, startDate, endDate, fn) {

    console.log("load sentiments");

    var url = _s.sprintf("https://psychsignal.com/api/sentiments?api_key=41910b4ec81feab42407b3270cb629d0&symbol=%s&from=%s&to=%s&period=d", symbol, startDate, endDate);

    console.log(url);

    request({
        url: url,
        json: true
    }, function(error, response, contents) {

        if (!error && response.statusCode == 200) {

            var data = {
                "symbol": symbol,
                "bullish": [],
                "bearish": [],
                "sentiments": []
            };

            var sentiments = contents.sentiments;

            sentiments.forEach(function(sent) {
                var date = sent.date,
                    bull = parseFloat(sent.bullish),
                    bear = parseFloat(sent.bearish);

                data.sentiments.push({
                    date: new Date(date),
                    bearish: bear,
                    bullish: bull
                });

                if (bull > bear){
                    data.bullish.push({
                        date: new Date(date),
                        value: bull,
                    });
                }
                else{
                    data.bearish.push({
                        date: new Date(date),
                        value: bear,
                    });
                }
                
            });

            return fn(null, data);
        }
    });
};
