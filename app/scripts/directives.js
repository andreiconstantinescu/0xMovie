define(['angular'], function(angular) {
    'use strict';

    return angular.module('MovieScribe.Directives', ['angularModalService'])
        .directive('accountOptions', ['$location', 'SessionService', 'AuthenticationService', 'MovieScribeAPI', function ($location, SessionService, AuthenticationService, MovieScribeAPI) {
            console.log("Initializing accountOptions");
            return {
                restrict: 'A',
                link: function link(scope, element, attrs) {
                    scope.currentSession = SessionService.getCurrentSession();

                    scope.showRecommendations = function () {
                        $location.path('/recommendations');
                    };

                    scope.goToTopsPage = function () {
                        $location.path('/welcome');
                    };

                    scope.goToProfile = function () {
                        $location.path('/profile');
                    };

                    scope.logout = function () {
                        AuthenticationService.logout();
                    };
                }
            }
        }])
        .directive('recommendationOptions', ['$timeout', 'MovieScribeAPI', 'ModalService', 'WebDatabase', function ($timeout, MovieScribeAPI, ModalService, WebDatabase) {

            return {
                restrict: 'A',
                link: function link(scope, element, attrs) {
                    scope.likeMovie = function (movie) {
                        MovieScribeAPI.likeMovie(movie.imdbID).then(function (response) {
                            console.log(response);
                            if (response.data.error != true) {
                                $timeout(function () {
                                    //scope.likedMovies.push(movie);
                                    WebDatabase.addToLikedMovies(movie);
                                    scope.IDLikedMovies[movie.imdbID] = true;
                                });
                            }
                        });
                    };
                    scope.openPopupWithMovie = function (movie) {
                        // Just provide a template url, a controller and call 'showModal'.
                        ModalService.showModal({
                            templateUrl: "views/moviedetails.html",
                            controller: "MoviePopupController",
                            inputs: {
                                movie: movie
                            }
                        }).then(function(modal) {
                            modal.element.modal();
                            modal.close.then(function(result) {
                                $scope.message = result ? "You said Yes" : "You said No";
                            });
                        });
                    };
                }
            };
        }]);
});