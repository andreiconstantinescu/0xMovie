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
        .directive('recommendationOptions', ['MovieScribeAPI', 'ModalService', function (MovieScribeAPI, ModalService) {

            return {
                restrict: 'A',
                link: function link(scope, element, attrs) {
                    scope.likeMovie = function (movieID) {
                        MovieScribeAPI.likeMovie(movieID).then(function (response) {
                            console.log(response);
                            if (response.data.error != true) {

                                // TODO Display message with OK

                                // TODO Update WebDatabase
                            }
                        });
                    };
                    scope.openPopupWithMovie = function (movie) {

                        console.log("AICI");

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