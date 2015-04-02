/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define([
	'angular',
	'angularRoute',
	'uiBootstrap',
	'services',
	'controllers'
], function (ng) {
	'use strict';
	
	return ng.module('MovieScribe', [
		'ngRoute',
		'ngSanitize',
		'ui.bootstrap',
		'angularModalService',
		'MovieScribe.Services',
		'MovieScribe.Controllers'
	]).constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	});
});