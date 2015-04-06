/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('MainController', ['$scope', '$rootScope', '$location', '$timeout', '$http', 'AuthenticationService', 'OMDB', 'MovieScribeAPI', function ($scope, $rootScope, $location, $timeout, $http, AuthenticationService, OMDB, MovieScribeAPI) {
			
			$scope.recommendationInput = "";
			
			$scope.showRecommendations = function () {
				// TODO improve this
				for (var i = 0 ; i < $scope.movies.length; i++) {
					if ($scope.movies[i].Title.indexOf($scope.recommendationInput) > -1) {
						console.log("AICI");
						$scope.movie = $scope.movies[i];
					}
				}
				
//				$scope.movie = $scope.movies[0];
				
				var splt = $scope.movie.Poster.split('/')[5];
				$scope.imageSrc = 'http://86.127.142.109:8080/RecommendationSystem/image/' + splt.substring(0, splt.length - 4);
			};
			
			$scope.movie = null;
			$scope.movies = null;
			MovieScribeAPI.getMovies().then(function (response) {
				console.log("RESPONSE", response.data);
				$scope.movies = response.data;
			});
			
			$scope.logout = function () {
				// Delete user data
				AuthenticationService.eraseAllData();
                AuthenticationService.removeUserAsAuthenticated(false);
				
				// Send the user to the landing page
				$location.path('/landingpage');
			};
			
			$rootScope.$on('syncUpdate', function (data) {
				
			});
			
//			var omdbUrl = 'http://www.omdbapi.com/?t=inception&y=&plot=full&r=json';
//			OMDB.getMovie(omdbUrl).
//				success(function(data, status, headers, config) {
//					// this callback will be called asynchronously
//					// when the response is available
//					$timeout(function () {
//						$scope.movie = {
//							Actors: data.Actors,
//							Awards: data.Awards,
//							Country: data.Country,
//							Director: data.Director,
//							Genre: data.Genre,
//							Language: data.Language,
//							Metascore: data.Metascore,
//							Plot: data.Plot,
//							Poster: data.Poster,
//							Rated: data.Rated,
//							Released: data.Released,
//							Response: data.Response,
//							Runtime: data.Runtime,
//							Title: data.Title,
//							Type: data.Type,
//							Writer: data.Writer,
//							Year: data.Year,
//							imdbID: data.imdbID,
//							imdbRating: data.imdbRating,
//							imdbVotes: data.imdbVotes
//						}
//						
//						var splt = $scope.movie.Poster.split('/')[5];
//						$scope.imageSrc = 'http://86.127.142.109:8080/RecommendationSystem/image/' + splt.substring(0, splt.length - 4);
//					});
//				}).
//				error(function(data, status, headers, config) {
//					// called asynchronously if an error occurs
//					// or server returns response with an error status.
//					console.log("Error when getting the movie from OMDB");
//				});
			
		}])
		.controller('LandingPageController', ['$scope', '$location', '$timeout', 'AuthenticationService', function ($scope, $location, $timeout, AuthenticationService) {
			
			// If user is already authenticated, redirect to home
			if (AuthenticationService.isUserAuthenticated()) {
                $location.path('/');
            }

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