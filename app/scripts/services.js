/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define(['angular'], function (angular) {
    'use strict';
    return angular.module('MovieScribe.Services', [])
        .service('SessionService', ['$cookieStore', function ($cookieStore) {
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
        .service('MovieScribeAPI', ['$http', function ($http) {

            var moviescribeEndpoint = "http://52.16.207.87:8080/MovieScribe/";

            var service = {
                getMovies: function () {
                    var url = "http://86.127.142.109:8080/RecommendationSystem/movies";
                    return $http.get(url);
                },
                getAllMovies: function () {
                    var url = moviescribeEndpoint + "movies";
                    return $http.get(url);
                },
                getLikedMovies: function () {
                    var url = moviescribeEndpoint + "liked" +
                        "/" + "" + // TODO: userID
                        "/" + ""; // TODO: authToken
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
        .service('AuthenticationService', ['$location', 'SessionService', function ($location, SessionService) {

            // Initialize Facebook SDK
            (function () {
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
            })();

            this.currentSession = undefined;

            this.isUserAuthenticated = function () {
                this.currentSession = SessionService.getCurrentSession();
                return (this.currentSession) ? true : false;
            };

            this.setUserAsAuthenticated = function (fbResponse) {
                console.log("Facebook response", fbResponse);
                SessionService.createSession(fbResponse.authResponse.userID, fbResponse.authResponse.accessToken);
            };

            this.logout = function () {
                // Delete user data
                SessionService.destroyCurrentSession();

                // Send the user to the landing page
                $location.path('/landingpage');
            };

            return this;
        }])
        .factory('WebDatabase', ['MovieScribeAPI', function(MovieScribeAPI) {

            var moviesList = undefined;
            var userLikedMovies = undefined;
            var charts = undefined;

            return {
                init: function () {
                    // Get all movies from eBooksManager API
                    MovieScribeAPI.getAllMovies().then(function (response) {
                        moviesList = response.data;
                    });

                    // Get all movies the user liked
                    MovieScribeAPI.getLikedMovies().then(function (response) {
                        console.log("getLikedMovies", response.data);
                        // TODO userLikedMovies = response.data;
                    });

                    // Get charts
                    MovieScribeAPI.getCharts.then(function (response) {
                        console.log("charts", response.data);
                        // TODO charts = response.data;
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