define(['angular'], function(angular) {
    'use strict';

    return angular.module('MovieScribe.Directives', [])
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
        .directive('recommendationOptions', ['MovieScribeAPI', function (MovieScribeAPI) {

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
                }
            };
        }]);
});