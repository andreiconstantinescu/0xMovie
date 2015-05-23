/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('LoginController', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {
			console.log("Initializing Login Controller");
		}])
		.controller('RegisterController', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {
			console.log("Initializing Register Controller");
		}])
		.controller('MainController', ['$scope', '$rootScope', '$location', '$timeout', '$http', 'AuthenticationService', 'WebDatabase', function ($scope, $rootScope, $location, $timeout, $http, AuthenticationService, WebDatabase) {

			// This will make the initial requests. (AllMovies, LikedMovies, Charts);
			WebDatabase.init();

			// Callback when WebDatabase.getAllMovies is done
			var removeGetAllMoviesDone = $rootScope.$on('getAllMoviesDone', function () {
				$scope.movies = WebDatabase.getAllMovies();
				console.log($scope.movies);
			});

			// Callback when WebDatabase.getAllLikedMovies is done
			var removeGetAllLikedMovies = $rootScope.$on('getAllMoviesDone', function () {

			});
			
			$scope.searchInput = "";
			$scope.displayMovies = false;
			$scope.movie = null;

			$scope.searchMovie = function () {
				// TODO improve this
				$scope.results = [];
				$timeout(function () {
					for (var i = 0 ; i < $scope.movies.length; i++) {

						var a = $scope.movies[i].Title.toLocaleLowerCase();
						var b = $scope.searchInput.toLowerCase();

						if (a.indexOf(b) > -1) {
							console.log("AICI");
//							$scope.movie = $scope.movies[i];
							$scope.results.push($scope.movies[i]);
							$scope.displayMovies = true;
						}
					}
					console.log($scope.movie);
					$scope.$apply();
				});
			};

			$scope.showRecommendations = function (movieObj) {

				function compare(a,b) {
					if (parseInt(a.imdbVotes) < parseInt(b.imdbVotes)) {
						return 1;
					}
					if (parseInt(a.imdbVotes) > parseInt(b.imdbVotes)) {
						return -1;
					}
					return 0;
				}
								
				var genre = movieObj.Genre.split(','); // array of genres
				console.log("GENRES", genre);
				
				$scope.results = [];
				$timeout(function () {
					for (var i = 0 ; i < $scope.movies.length; i++) {

						var a = $scope.movies[i].Genre;
						var b = $scope.searchInput.toLowerCase();

						if (a.indexOf(genre[0]) > -1 && movieObj.Title != $scope.movies[i].Title) {
//							$scope.movie = $scope.movies[i];
							$scope.results.push($scope.movies[i]);
							$scope.displayMovies = true;
						}
					}
					$scope.results.sort(compare);
					console.log($scope.results);
					$scope.$apply();
				});
				
				
				
				// Extract movie image
//				var splt = $scope.movie.Poster.split('/')[5];
//				$scope.imageSrc = 'http://86.127.142.109:8080/RecommendationSystem/image/' + splt.substring(0, splt.length - 4);
			};

			$scope.logout = function () {
				AuthenticationService.logout();
			};

			// Prevent memory leaks
			$scope.$on('$destroy', function () {
				removeGetAllMoviesDone();
				removeGetAllLikedMovies();
			});
		}])
		.controller('LandingPageController', ['$scope', '$location', '$timeout', '$http', 'AuthenticationService', function ($scope, $location, $timeout, $http, AuthenticationService) {
			
			// If user is already authenticated, redirect to home
			if (AuthenticationService.isUserAuthenticated()) {
                $location.path('/');
            }

			$scope.facebookLogin = function () {
				FB.login(function (res) {
					console.log(res);

					var accessToken = res.authResponse.accessToken;
					console.log(accessToken);

					AuthenticationService.loginWithFacebok(accessToken).then(function (response) {

						if (response.data) {
							console.log("RASPOUNDASDAS", response);
							AuthenticationService.setUserAsAuthenticated(response.ID, accessToken);
							$timeout(function () {
								$location.path('/');
							});
						} else {
							AuthenticationService.loginWithFacebok(accessToken).then(function (responseSecond) {
								console.log("2222RASPOUNDASDAS", responseSecond);
								AuthenticationService.setUserAsAuthenticated(responseSecond.data.userId, accessToken);
								$timeout(function () {
									$location.path('/');
								});
							});
						}
					});


				});
			};

			var charts = null;
			$scope.loading = true;
			//var charts = $http.get('http://52.16.207.87:8080/MovieScribe/charts', function (response) {
			//	console.log('charts request', response);
			//	charts = response;
			//});
		}]);
});