/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('MainController', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
			
			$scope.logout = function () {
				// Delete user data
				AuthenticationService.eraseAllData();
                AuthenticationService.removeUserAsAuthenticated(false);
				
				// Send the user to the landing page
				$location.path('/landingpage');
			};
			$scope.userData = AuthenticationService.getUserData();
		}])
		.controller('LandingPageController', ['$scope', '$location', '$timeout', 'AuthenticationService', function ($scope, $location, $timeout, AuthenticationService) {
			
			// If user is already authenticated, redirect to home
			if (AuthenticationService.isUserAuthenticated()) {
                $location.path('/');
            }
						
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
					$timeout(function () {
						$location.path('/');
					});
				});
			}
			
			$scope.test = function () {
				$location.path('/');
			};

		}]);
});