/**
 * Created by Gabriel on 31/03/15.
 */

define([
	'angular',
	'app'
], function (angular, app) {
	'use strict';
	
	return app.config(['$compileProvider', '$routeProvider', '$locationProvider', function ($compileProvider, $routeProvider, $locationProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
		$routeProvider
			.when('/landingpage', {
				templateUrl: 'views/landingpage.html',
				requireLogin: false
			})
			.when('/', {
				templateUrl: 'views/main.html',
				requireLogin: true
			});
		
		$routeProvider.otherwise({
			redirectTo: '/'
		});
	}]);
});