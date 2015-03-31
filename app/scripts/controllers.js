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
		.controller('LandingPageController', ['$scope', 'mvAuthentication', function ($scope, mvAuthentication) {
			
			// If user is already authenticated, redirect to home
			if (mvAuthentication.isUserAuthenticated()) {
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
					console.log("Response");
				});
			}
			
		}]);
});