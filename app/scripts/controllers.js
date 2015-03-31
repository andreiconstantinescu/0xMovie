/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('MainController', ['$scope', function ($scope) {
			
			$scope.test = function () {
				console.log("TESTING");
			};
			
			
		}])
		.controller('LandingPageController', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
			
			// If user is already authenticated, redirect to home
			if (AuthenticationService.isUserAuthenticated()) {
                $location.path('/');
            }
			
			$scope.userAuthenticated = AuthenticationService.isUserAuthenticated();
			$scope.$on('LoggedIn', function () {
				$scope.userAuthenticated = AuthenticationService.isUserAuthenticated();
				$scope.$apply();
			});
			
			
			$scope.init = function() {
								
                window.fbAsyncInit = function() {
					FB.init({
					  appId      : '883126045059442',
					  xfbml      : true,
					  version    : 'v2.3'
					});
				  };

				(function(d, s, id){
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {return;}
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
            };
			
			$scope.facebookLogin = function () {
				FB.login(function (response) {
					AuthenticationService.setUserAsAuthenticated(response);
					$scope.$broadcast('LoggedIn');
				});
			}
			
		}]);
});