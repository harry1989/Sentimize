app.controller('DashBoardCtrl', ['$scope', 'DashBoardService', function($scope, DashBoardService){
	
	$scope.loading = true;

	DashBoardService.stocks().then(function(response){
		
		var data = response.data;

		$scope.loading = false;
		var stocks = data.stocks;
		stocks.forEach(function(stock){
			stock.sentimetric = parseFloat(stock.sentimetric);
		});

		$scope.stocks = stocks;
		$scope.symbols = data.symbols;
		$scope.marketSentiments = data.marketSentiments;

	});
}]);

app.controller('ChartCtrl', ['', function(){
	
}]);

app.controller('NewsCtrl', ['', function(){
	
}]);

app.controller('TweetCtrl', ['', function(){
	
}]);