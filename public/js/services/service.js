app.factory('DashBoardService', ['$http', function($http){
	var getStocks = function(){
		return $http.get('/api/overview');
	}

	return {
		stocks : getStocks
	}
}]);



// Range filter tp support in for loops

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++) {
      input.push(i);
    }
    return input;
  };
});