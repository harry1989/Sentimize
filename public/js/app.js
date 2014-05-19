var app = angular.module('Sentimize', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('dashboard', {
		url: '/',
		templateUrl : '/templates/dashboard.html',
		controller: 'DashBoardCtrl'
	})
	.state('spanshot', {
		url: '/spanshot/:symbol',
		views : {
			'chart' : {
				templateUrl: '/templates/chart.html',
				controller: 'ChartCtrl'
			},
			'news' : {
				templateUrl: '/templates/chart.html',
				controller: 'NewsCtrl'
			}
			'tweets' : {
				templateUrl: '/templates/chart.html',
				controller: 'TweetCtrl'
			}
		}
	});
});