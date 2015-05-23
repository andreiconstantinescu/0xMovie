/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define(['angular'], function (angular) {
    'use strict';
    return angular.module('MovieScribe.Services', [])
        .service('SessionService', ['$cookieStore', '$rootScope', function ($cookieStore, $rootScope) {
            var session = {
                userID: $cookieStore.get('userID'),
                authToken: $cookieStore.get('authToken')
            };

            return {
                createSession: function (userID, authToken) {
                    console.log("Create new session with userID: " + userID + ", authToken: " + authToken);

                    session.userID = userID;
                    session.authToken = authToken;

                    // Write the current session in cookies
                    $cookieStore.put('userID', session.userID);
                    $cookieStore.put('authToken', session.authToken);

                    $rootScope.$broadcast('currentSessionUpdated');
                },
                destroyCurrentSession: function () {
                    console.log("Current session destroyed");

                    session.userID = null;
                    session.authToken = null;

                    // Remove the user session from Cookies
                    $cookieStore.remove('userID');
                    $cookieStore.remove('authToken');
                },
                getCurrentSession: function () {
                    if (session.userID) {
                        return session;
                    }
                    return null;
                }
            }
        }])
        .service('MovieScribeAPI', ['$http', '$rootScope', 'SessionService', function ($http, $rootScope, SessionService) {

            var moviescribeEndpoint = "http://52.16.207.87:8080/MovieScribe/";
            var currentSession = SessionService.getCurrentSession();

            $rootScope.$on('currentSessionUpdated', function () {
                currentSession = SessionService.getCurrentSession();
            });

            var service = {
                getAllMovies: function () {
                    var url = moviescribeEndpoint + "movies";

                    console.log("URL getAllMovies", url);
                    return $http.get(url);
                },
                getLikedMovies: function () {
                    var url = moviescribeEndpoint + "likedmovies" +
                        "/" + currentSession.userID +
                        "/" + currentSession.authToken;

                    console.log("URL getLikedMovies", url);
                    return $http.get(url);
                },
                getCharts: function () {
                    var url = moviescribeEndpoint + "charts";

                    console.log("URL getCharts", url);
                    return $http.get(url);
                },
                likeMovie: function (movieID) {
                    var url = moviescribeEndpoint + "like" +
                        "/" + "" + // TODO: userID
                        "/" + "" + // TODO: authToken
                        "/" + movieID.toString();
                    return $http.get(url);
                }
            };

            return service;
        }])
        .service('AuthenticationService', ['$location', 'SessionService', 'MovieScribeAPI', function ($location, SessionService, MovieScribeAPI) {

            this.currentSession = undefined;

            this.isUserAuthenticated = function () {
                this.currentSession = SessionService.getCurrentSession();
                return (this.currentSession) ? true : false;
            };

            this.setUserAsAuthenticated = function (userID, authToken) {
                SessionService.createSession(userID, authToken);
            };

            this.logout = function () {
                // Delete user data
                SessionService.destroyCurrentSession();

                // Send the user to the landing page
                $location.path('/landingpage');
            };

            return this;
        }])
        .factory('WebDatabase', ['$rootScope', 'MovieScribeAPI', function($rootScope, MovieScribeAPI) {

            var moviesList = undefined;
            var userLikedMovies = undefined;
            var charts = undefined;

            return {
                init: function () {
                    // Get all movies from eBooksManager API
                    MovieScribeAPI.getAllMovies().then(function (response) {
                        moviesList = response.data;
                        $rootScope.$broadcast('getAllMoviesDone');
                    });

                    // Get all movies the user liked
                    MovieScribeAPI.getLikedMovies().then(function (response) {
                        userLikedMovies = response.data;
                        $rootScope.$broadcast('getLikedMovies');
                    });

                    // Get charts
                    MovieScribeAPI.getCharts().then(function (response) {
                        charts = response.data;
                        $rootScope.$broadcast('getCharts');
                    });
                },
                getAllMovies: function () {
                    return moviesList;
                },
                getLikedMovies: function () {
                    return userLikedMovies;
                },
                getCharts: function () {
                    return charts;
                },
                likeMovie: function () {

                }
            }
        }])
});