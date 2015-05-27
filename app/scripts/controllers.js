/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('LoginController', ['$scope', '$location', 'SessionService', 'AuthenticationService', 'MovieScribeAPI', function ($scope, $location, SessionService, AuthenticationService, MovieScribeAPI) {

			$scope.credentials = {};

			$scope.goToLandingPage = function () {
				$location.path('/');
			};

			$scope.login = function () {
				MovieScribeAPI.login($scope.credentials).then(function (response) {
					if (response.data.error == true) {
						$scope.errorMessage = "Email or password incorrect.";
						return;
					}

					// Create new session (cookies)
					SessionService.createSession(
						response.data.userId,
						response.data.authToken,
						response.data.firstName,
						response.data.lastName,
						response.data.email
					);

					// Redirect to main page
					$location.path('/');
				});
			};
		}])
		.controller('RegisterController', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {

			$scope.credentials = {};

			$scope.goToLandingPage = function () {
				$location.path('/');
			};

			$scope.register = function () {
				console.log($scope.credentials);

				if ($scope.credentials.password == $scope.credentials.password_repeat) {
					AuthenticationService.register($scope.credentials);
				} else {
					$scope.errorMessage = "Passwords doesn't match."
				}
			};
		}])
		.controller('MainController', ['$scope', '$rootScope', '$location', '$timeout', '$http', 'AuthenticationService', 'WebDatabase', 'SessionService', function ($scope, $rootScope, $location, $timeout, $http, AuthenticationService, WebDatabase, SessionService) {

			// This will make the initial requests. (AllMovies, LikedMovies, Charts);
			$scope.loading = true;
			WebDatabase.init();

			$scope.movies = WebDatabase.getAllMovies();
			$scope.IDUserLikedMovies = WebDatabase.getIDUserLikedMovies();
			console.log($scope.IDUserLikedMovies = WebDatabase.getIDUserLikedMovies());
			if($scope.movies && $scope.movies.length) {
				$scope.loading = false;
			}

			// Callback when WebDatabase.getAllMovies is done
			var removeGetAllMoviesDone = $rootScope.$on('getAllMoviesDone', function () {
				$scope.movies = WebDatabase.getAllMovies();
				$scope.loading = false;
				console.log($scope.movies);
			});

			// Callback when WebDatabase.getAllLikedMovies is done
			var removeGetAllLikedMovies = $rootScope.$on('getLikedMovies', function () {
				$scope.likedMovies = WebDatabase.getLikedMovies();
			});

			// Callback when WebDatabase.getIDUserLikedMovies
			var removeGetIDUserLikedMovies = $rootScope.$on('getIDUserLikedMovies', function () {
				$scope.IDUserLikedMovies = WebDatabase.getIDUserLikedMovies();
				console.log($scope.IDUserLikedMovies);
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
							$scope.results.push($scope.movies[i]);
							$scope.displayMovies = true;
						}
					}

					if ($scope.results.length > 0) {
						$scope.moviesAvailable = true;
					} else {
						$scope.moviesAvailable = false;
					}

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
			};

			$scope.goToProfile = function () {
				$location.path('/profile');
			};

			// Prevent memory leaks
			$scope.$on('$destroy', function () {
				removeGetAllMoviesDone();
				removeGetAllLikedMovies();
				removeGetIDUserLikedMovies();
			});
		}])
		.controller('LandingPageController', ['$scope', '$location', '$http', 'AuthenticationService', function ($scope, $location, $http, AuthenticationService) {

			// If user is already authenticated, redirect to home
			if (AuthenticationService.isUserAuthenticated()) {
                $location.path('/');
            }

			$scope.goToLogin = function () {
				$location.path('/login');
			};
			$scope.goToRegister = function () {
				$location.path('/register');
			};

			var charts = null;
			$scope.loading = true;
			//var charts = $http.get('http://52.16.207.87:8080/MovieScribe/charts', function (response) {
			//	console.log('charts request', response);
			//	charts = response;
			//});
		}])
		.controller('WelcomeController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'MovieScribeAPI', 'SessionService', 'WebDatabase', function ($scope, $rootScope, $location, AuthenticationService, MovieScribeAPI, SessionService, WebDatabase) {
			console.log("Initializing WelcomeController");

			// Make initial requests
			WebDatabase.init();
			$scope.loading = true;
			$scope.IDLikedMovies = {};
			$scope.movies = WebDatabase.getAllMovies();
			$scope.likedMovies = WebDatabase.getLikedMovies();
			$scope.IDLikedMovies = WebDatabase.getIDUserLikedMovies();

			// UI variables
			$scope.charts = null;

			$scope.goToMainPage = function () {
				$location.path('/');
			};

			$rootScope.$on('getChartsDone', function () {
				$scope.loading = false;
				$scope.charts = WebDatabase.getCharts();

				console.log($scope.charts);
			});

			$rootScope.$on('getLikedMovies', function () {
				$scope.likedMovies = WebDatabase.getLikedMovies();
			});

			$rootScope.$on('getIDUserLikedMovies', function () {
				$scope.IDLikedMovies = WebDatabase.getIDUserLikedMovies();
			});
		}])
		.controller('MoviePopupController', ['$scope', 'WebDatabase', 'movie', function ($scope, WebDatabase, movie) {
			console.log("MoviePopupController initialized");
			$scope.movie = movie;
			$scope.likedMovies = WebDatabase.getLikedMovies();
		}])
		.controller('ProfileController', ['$scope', 'WebDatabase', function ($scope, WebDatabase) {
			$scope.likedMovies = WebDatabase.getLikedMovies();
		}]);
});