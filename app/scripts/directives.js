define(['angular'], function(angular) {
    'use strict';

    return angular.module('MovieScribe.Directives', ['angularModalService'])
        .directive('accountOptions', ['SessionService', 'AuthenticationService', function (SessionService, AuthenticationService) {
            console.log("Initializing accountOptions");

            return {
                restrict: 'A',
                link: function link(scope, element, attrs) {
                    scope.currentSession = SessionService.getCurrentSession();

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

                        console.log("AICIC");

                        MovieScribeAPI.likeMovie(movie.imdbID).then(function (response) {
                            console.log(response);
                            if (response.data.error != true) {
                                $timeout(function () {
                                    //scope.likedMovies.push(movie);
                                    WebDatabase.addToLikedMovies(movie);
                                    scope.IDLikedMovies[movie.imdbID] = true;
                                });

                                if (scope.likedMovies.length > 4) {
                                    scope.goToMainPage();
                                }
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