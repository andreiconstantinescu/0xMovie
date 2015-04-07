/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define(['angular'], function (angular) {
    'use strict';
    return angular.module('MovieScribe.Services', [])
		.factory('Storage', ['$rootScope', function ($rootScope) {

            var defaultOptions = {
                namespace: "MovieScribe",
                debug: true
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
		.service('OMDB', ['$http', function ($http) {
			var service = {
				getMovie: function (url) {
					return $http.get(url);
				},
				vladTest: function () {
					
					var req = {
						method: 'GET',
						url: 'http://188.24.169.17:8080/RecommendationSystem/api/movies/John',
						headers: {
							'Content-Type': 'application/json'
						}
					}
					
					return $http(req).
						success(function(data, status, headers, config) {
							console.log("SUCCESS", data);
						}).
						error(function(data, status, headers, config) {
							console.log("ERROR", data);
						});
				}
			};
			
			return service;
		}])
		.service('MovieScribeAPI', ['$http', function ($http) {
			
			var service = {
				getMovies: function () {
					var url = "http://86.127.142.109:8080/RecommendationSystem/movies";
					return $http.get(url);
				}
			};
			
//			var localMovies = null;
//			service.getMovies().
//				success(function(data, status, headers, config) {
//					console.log("getMovies Success");
//					console.log(data);
//					
//					localMovies = data;
//					$rootScope.$broadcast('syncUpdate');
//				}).
//				error(function(data, status, headers, config) {
//					console.log("getMovies Error");
//				});
			
			
			return service;
		}])
	    .service('AuthenticationService', ['Storage', function (Storage) {
			
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
			
			// Initialize Storage factory
			Storage._initialize({debug: false});
			var userAuthenticated = false;

			this.isUserAuthenticated = function () {
				if (userAuthenticated == false) {
					var facebookLoginData = Storage.read('facebookLoginData');
					if (facebookLoginData != undefined && facebookLoginData.authResponse) {
							userAuthenticated = true;
					}
				}
				
				return userAuthenticated;
			};

			this.setUserAsAuthenticated = function (fbResponse) {
				var storageContent = Storage.read('facebookLoginData') || {};
                storageContent = fbResponse;
                Storage.save('facebookLoginData', storageContent);
			};
			
			this.removeUserAsAuthenticated = function () {
				userAuthenticated = false;
			};
			
			this.eraseAllData = function () {
				Storage.deleteAllForApp();
			};
			
			this.getUserData = function () {
				return Storage.read('facebookLoginData');
			};

			return this;
		}])
		.service('Trailers', ['$http', function ($http) {
			console.log('initialize Trailers');
			
			var service = {
				getTrailer: function (movie) {
					var search = {
						key: '9d2bff12ed955c7f1f74b83187f188ae',
						id: null,
						year: null,
						movie: movie,
						options: {
							host: 'api.themoviedb.org',
							port: 443,
							path: null
						}
					}
					search.options.path = encodeURI('/3/search/movie?api_key=' + search.key + '&query=' + search.movie + ((search.year !== null) ? '&year='+search.year : ''));
					
					var url = search.options.host + ":" + search.options.port + search.options.path;
					console.log(url);
				}
			};
			
			return service;	
		}]);
});