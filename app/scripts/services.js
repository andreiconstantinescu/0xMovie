/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define(['angular'], function (angular) {
    'use strict';
    return angular.module('MovieScribe.Services', [])
        .factory('Storage', ['$rootScope', function ($rootScope) {

            var defaultOptions = {
                namespace: "Jukebox",
                debug: false
            };

            var service = {

                model: {
                    name: '',
                    email: ''
                },

                _initialize: function (pOptions) {
                    this.options = angular.extend(defaultOptions, pOptions);

                    this._namespace = (defaultOptions.namespace || '') + '_';
                    this._debug = defaultOptions.debug;
                    if (this.isSupported) {
                        this._enabled = true;
                        // Hook onto and listen for storage engine events
                        if (window.addEventListener) {
                            window.addEventListener("storage", this._events, false);
                        } else {
                            window.attachEvent("onstorage", this._events);
                        }
                    } // No need for else, as it has a default init value
                    if (this._debug) {
                        console.log("Storage initialized ...");
                        console.log(this.options);
                        console.log(this._namespace);
                    }
                },

                version: 1.0,

                fullLength: function () {
                    return localStorage.length;
                },

                length: function () {
                    var ks = 0;
                    try {
                        for (var i = 0, j = localStorage.length; i < j; i++) {
                            // Test if the current key is in the namespace
                            var delKey = localStorage.key(i).substring(this._namespace.length),
                                tKey = localStorage.key(i).substring(0, this._namespace.length);
                            if (tKey == this._namespace) {
                                if (this._debug) console.log("Counting the key: " + delKey);
                                ks++;
                            }
                        }
                    } catch (e) {
                        return false;
                    }
                    return ks;
                },

                getKeys: function () {
                    var ks = [];
                    try {
                        for (var i = 0, j = localStorage.length; i < j; i++) {
                            // Test if the current key is in the namespace
                            var delKey = localStorage.key(i).substring(this._namespace.length),
                                tKey = localStorage.key(i).substring(0, this._namespace.length);
                            if (tKey == this._namespace) {
                                if (this._debug) console.log("Adding the key: " + delKey);
                                ks[i] = tKey + delKey;
                            }
                        }
                    } catch (e) {
                        return false;
                    }
                    return ks;
                },

                getAllKeys: function () {
                    var ks = [];
                    try {
                        for (var i = 0, j = localStorage.length; i < j; i++) {
                            ks[i] = localStorage.key(i);
                        }
                    } catch (e) {
                    }
                    return ks;
                },

                deleteAllForApp: function () {
                    if (this._debug) console.log("Deleting the entire local storage for this domain.");
                    try {
                        localStorage.clear();
                    } catch (e) {
                        return false;
                    }
                    return true;
                },

                /**
                 * The namespace for the keys (allows for multi-instances)
                 */
                _namespace: '',

                /**
                 * Debugging, obviously
                 */
                _debug: false,

                /**
                 * Sorage variable indicating whether the storage engine is active or not
                 * Default is off. Its better to have it stored as a variable, otherwise you will end up
                 *  spamming the poor DOM Window engine with functino requests everytime and could lead to poor
                 *  memory handling
                 */
                _enabled: false,

                /**
                 * Checks if the browser supports HTML5 storage
                 */
                isSupported: function () {
                    try {
                        if ('localstorage' in window && window['localstorage'] !== null || 'localStorage' in window && window['localStorage'] !== null) {
                            return true;
                        }
                    } catch (e) {
                        return false;
                    }
                },

                /**
                 * Used to check if a key exists
                 */
                exists: function (key) {
                    var _t;
                    if (!this._enabled) {
                        if (this._debug) console.log('Engine not available');
                        return false;
                    }
                    try {
                        if (this._debug) {
                            console.log('Current namespace is %s', this._namespace);
                            console.log('Checking if %s exists', this._namespace + key);
                        }
                        _t = this.read(key);
                        if (this._debug) console.log('Type of key %s', typeof _t);
                        if (_t != null && _t != false) {
                            if (this._debug) console.log('Key %s exists with the current value of %s', this._namespace + key, this.read(key));
                            return true;
                        } else {
                            if (this._debug) console.log('Key %s doesn\'t exist', this._namespace + key);
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                },

                /**
                 * Create a element in the storage engine
                 */
                save: function (key, value) {
                    if (!this._enabled) {
                        if (this._debug) console.log('Engine not available');
                        return false;
                    }
                    try {
                        if (this._debug) {
                            console.log('Current namespace is %s', this._namespace);
                            console.log('Setting value for %s', this._namespace + key);
                        }
                        value = angular.toJson(value); // Store items as JSON
                        localStorage.setItem(this._namespace + key, value);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },

                /**
                 * Get a item from the storage engine
                 */
                read: function (key) {
                    var _v;
                    if (!this._enabled) {
                        if (this._debug) console.log('Engine not available');
                        return false;
                    }
                    try {
                        _v = angular.fromJson(localStorage.getItem(this._namespace + key));
                        if (this._debug) {
                            console.log('Current namespace is %s', this._namespace);
                            console.log('Key being retrieved %s', this._namespace + key);
                            console.log('The value of the key is %s', _v);
                        }
                        return _v;
                    } catch (e) {
                        return false;
                    }
                },


                /**
                 * Remove a item from the storage engine
                 */
                remove: function (key) {
                    if (!this._enabled) {
                        if (this._debug) console.log('Engine not available');
                        return false;
                    }
                    try {
                        if (this._debug) {
                            console.log('Current namespace is %s', this._namespace);
                            console.log('Key to remove %s', this._namespace + key);
                        }
                        localStorage.removeItem(this._namespace + key);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },

                /**
                 * Clear the storage engine for this namespance ONLY
                 * This is different to the default clear from HTML5 storage engines
                 * The default clears everything, but since I am supporting multi-instances
                 *  and namespaces this is needed
                 */
                clear: function () {
                    var i, delKey, tKey;
                    if (!this._enabled) {
                        if (this._debug) console.log('Engine not available');
                        return false;
                    }
                    try {
                        for (i = 0; i < localStorage.length; i++) {
                            // Test if the current key is in the namespace
                            delKey = localStorage.key(i).substring(this._namespace.length);
                            tKey = localStorage.key(i).substring(0, this._namespace.length);
                            if (this._debug) {
                                console.log("testKEY: " + tKey);
                                console.log("delKEY: " + delKey);
                            }
                            if (tKey == this._namespace) {
                                if (this._debug) console.log("Deleting the key: " + delKey);
                                this.remove(delKey);
                            }
                        }
                    } catch (e) {
                        return false;
                    }
                    return true;
                },

                /**
                 * The storage engine event handler
                 * This only gets called when a modification on the storage engine was successful
                 * The event data (e in this instance) will contain the following information:
                 *  key : string : the named key that was added, removed, or modified
                 *  oldValue : any : the previous value (now overwritten), or null if a new item was added
                 *  newValue : any : the new value, or null if an item was removed
                 *  url : string : the page which called a method that triggered this change
                 */
                _events: function (e) {
                    // IE Fix since it stores the event data in window.event and doesn't pass it
                    if (!e) {
                        e = window.event;
                    }
                    /**
                     * Some browsers shipped with the storageEvent class having a uri property instead of a url property
                     *  as the specification was not yet finalized. Just need to filter for these for maximum compatibility
                     */
                    e.url = e.url || e.uri;

                    if (this._debug) {
                        console.group('StorageEvent');
                        console.log("event: " + e);
                        console.log('key: ', e.key);
                        console.log('oldValue: ', e.oldValue);
                        console.log('newValue: ', e.newValue);
                        console.log('url: ', e.url);
                        console.groupEnd('StorageEvent');
                    }
                },

                SaveState: function () {
                    sessionStorage.userService = angular.toJson(service.model);
                },

                RestoreState: function () {
                    service.model = angular.fromJson(sessionStorage.userService);
                }
            };

            $rootScope.$on("savestate", service.SaveState);
            $rootScope.$on("restorestate", service.RestoreState);

            return service;
        }])
        .service('SessionService', ['$cookieStore', '$rootScope', function ($cookieStore, $rootScope) {
            var session = {
                userID: $cookieStore.get('userID'),
                authToken: $cookieStore.get('authToken'),
                firstName: $cookieStore.get('firstName'),
                lastName: $cookieStore.get('lastName'),
                email: $cookieStore.get('email')
            };

            return {
                createSession: function (userID, authToken, firstName, lastName, email) {
                    console.log("Create new session with userID: " + userID + ", authToken: " + authToken);

                    session.userID = userID;
                    session.authToken = authToken;
                    session.firstName = firstName;
                    session.lastName = lastName;
                    session.email = email;

                    // Write the current session in cookies
                    $cookieStore.put('userID', session.userID);
                    $cookieStore.put('authToken', session.authToken);
                    $cookieStore.put('firstName', session.firstName);
                    $cookieStore.put('lastName', session.lastName);
                    $cookieStore.put('email', session.email);

                    $rootScope.$broadcast('currentSessionUpdated');
                },
                destroyCurrentSession: function () {
                    console.log("Current session destroyed");

                    session.userID = null;
                    session.authToken = null;
                    session.firstName = null;
                    session.lastName = null;
                    session.email = null;

                    // Remove the user session from Cookies
                    $cookieStore.remove('userID');
                    $cookieStore.remove('authToken');
                    $cookieStore.remove('firstName');
                    $cookieStore.remove('lastName');
                    $cookieStore.remove('email');
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
                login: function (credentials) {
                    var url = moviescribeEndpoint + "login";
                    return $http({
                        method: 'POST',
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {email: credentials.email, password: credentials.password}
                    });
                },
                register: function (credentials) {
                    var url = moviescribeEndpoint + "register";
                    return $http({
                        method: 'POST',
                        url: url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            firstName: credentials.firstName,
                            lastName: credentials.lastName,
                            email: credentials.email,
                            password: credentials.password
                        }
                    });
                },
                getAllMovies: function () {
                    var url = moviescribeEndpoint + "movies";

                    console.log("URL getAllMovies", url);
                    return $http.get(url);
                },
                getLikedMovies: function () {
                    var url = moviescribeEndpoint + "likedmovies/" + currentSession.userID +
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
                    var url = moviescribeEndpoint + "like/" + currentSession.userID +
                        "/" + currentSession.authToken + // TODO: authToken
                        "/" + movieID.toString();
                    return $http.get(url);
                },
                getMoviesByActor: function (actorName) {
                    var url = moviescribeEndpoint + "actor/" + actorName.toString();
                    return $http.get(url);
                },
                getMoviesByGenre: function (genre) {
                    var url = moviescribeEndpoint + "genre/" + genre.toString();
                    return $http.get(url);
                },
                getMoviesByActorAndGenre: function(actorName, genre) {
                    var url = moviescribeEndpoint + "actor/" + actorName.toString +
                        "genre/" + genre.toString();
                    return $http.get(url);
                },
                getImageLink: function (imageHash) {
                    var url = moviescribeEndpoint + "image/" + imageHash;
                    return $http.get(url);
                },
                getTopMovies: function (numberOfMovies) {
                    var url = moviescribeEndpoint + "top/" + numberOfMovies;
                    return $http.get(url);
                },
                getRecommendations: function () {
                    var url = moviescribeEndpoint + "recommendations/" + currentSession.userID;
                    return $http.get(url);
                }
            };

            return service;
        }])
        .service('AuthenticationService', ['$location', 'SessionService', 'MovieScribeAPI', 'Storage', function ($location, SessionService, MovieScribeAPI, Storage) {

            var currentSession = undefined;
            var service = {
                isUserAuthenticated: function () {
                    currentSession = SessionService.getCurrentSession();
                    return (currentSession) ? true : false;
                },
                register: function (credentials) {
                    // Make request to our API to send crendentials and get response
                    MovieScribeAPI.register(credentials).then(function (response) {
                        // Login
                        MovieScribeAPI.login(credentials).then(function (response) {
                            // Create new session (cookies)
                            SessionService.createSession(
                                response.data.userId,
                                response.data.authToken,
                                response.data.firstName,
                                response.data.lastName,
                                response.data.email
                            );

                            // Redirect to welcome page
                            $location.path('/welcome');
                        });
                    });
                },
                login: function (credentials) {
                    // Make request to our API to send crendentials and get response

                },
                logout: function () {
                    // Delete user data
                    SessionService.destroyCurrentSession();
                    Storage.deleteAllForApp();

                    // Send the user to the landing page
                    $location.path('/landingpage');
                }
            };
            return service;
        }])
        .factory('WebDatabase', ['$rootScope', 'MovieScribeAPI', 'Storage', function($rootScope, MovieScribeAPI, Storage) {

            Storage._initialize({debug: false});

            var moviesList = Storage.read('MovieScribe.Movies') || undefined;
            var userLikedMovies = Storage.read('MovieScribe.LikedMovies') || undefined;
            var IDUserLikedMovies = Storage.read('MovieScribe.IDUserLikedMovies') || {};
            var charts = undefined;

            return {
                init: function () {

                    console.log("INIT", moviesList, userLikedMovies, charts);

                    if (moviesList == undefined) {
                        // Get all movies from eBooksManager API
                        MovieScribeAPI.getAllMovies().then(function (response) {
                            moviesList = response.data;
                            Storage.save('MovieScribe.Movies', response.data);
                            $rootScope.$broadcast('getAllMoviesDone');
                        });
                    }

                    if(userLikedMovies == undefined) {
                        // Get all movies the user liked
                        MovieScribeAPI.getLikedMovies().then(function (response) {
                            userLikedMovies = response.data;
                            Storage.save('MovieScribe.LikedMovies', response.data);
                            $rootScope.$broadcast('getLikedMovies');

                            for (var i = 0; i < userLikedMovies.length; i++) {
                                IDUserLikedMovies.push(userLikedMovies[i].imdbID);
                            }

                            Storage.save('MovieScribe.IDUserLikedMovies', IDUserLikedMovies);
                            $rootScope.$broadcast('getIDUserLikedMovies');
                        });
                    }

                    if (charts == undefined) {
                        // Get charts
                        MovieScribeAPI.getCharts().then(function (response) {
                            charts = response.data;
                            $rootScope.$broadcast('getChartsDone');
                        });
                    }
                },
                setCharts: function (chartsObject) {
                    charts = chartsObject;
                },
                getAllMovies: function () {
                    return moviesList;
                },
                getLikedMovies: function () {
                    return userLikedMovies;
                },
                getIDUserLikedMovies: function () {
                    return IDUserLikedMovies;
                },
                addToLikedMovies: function (movie) {
                    userLikedMovies.push(movie);
                    Storage.save('MovieScribe.LikedMovies', userLikedMovies);

                    IDUserLikedMovies[movie.imdbID] = true;
                    Storage.save('MovieScribe.IDUserLikedMovies', IDUserLikedMovies);
                },
                getCharts: function () {
                    return charts;
                },
                likeMovie: function () {

                }
            }
        }])
});