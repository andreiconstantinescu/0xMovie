/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('MainController', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
			
			
			$scope.loginData = AuthenticationService.getUserData();
			
			$scope.testLogin = function () {
				AuthenticationService.facebookLogin();
			};
			
			$scope.logout = AuthenticationService.logout;
		}])
		.controller('LandingPageController', ['$scope', '$rootScope', '$location', '$timeout', 'AUTH_EVENTS', 'AuthenticationService', function ($scope, $rootScope, $location, $timeout, AUTH_EVENTS, AuthenticationService) {			
			// If user is already authenticated, redirect to home
			if (AuthenticationService.isAuthenticated()) {
                $location.path('/');
            }
			
			// Scope methods (available in UI)
			$scope.facebookLogin = function () {
				AuthenticationService.facebookLogin().then(function (fbResponse) {
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					AuthenticationService.setLoginData(fbResponse);
					$location.path('/');
				}, function () {
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
				});
			}
		}]);
});