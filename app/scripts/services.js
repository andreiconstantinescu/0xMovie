/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define(['angular'], function (angular) {
    'use strict';
    return angular.module('MovieScribe.Services', [])
	    .service('mvAuthentication', function () {
			this.isUserAuthenticated = function () {
			    
			    // TODO Implement this
			    return false;
			};
	  
			return this;
		});
});