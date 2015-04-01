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
			redirectTo: '/landingpage'
		});
	}])
	.run(['$rootScope', 'AuthenticationService', '$location', function ($rootScope, AuthenticationService, $location) {
		
		// Check the auth status for every route chane
		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			// if you're logged out send to login page.
			if (next.requireLogin && !AuthenticationService.isUserAuthenticated()) {
				$location.path('/landingpage');
				event.preventDefault();
			}
		});
	}]);
});