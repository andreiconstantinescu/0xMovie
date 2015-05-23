/**
 * Created by Gabriel on 31/03/15.
 */

/*global define*/

define([
	'angular',
	'angularRoute',
	'angularCookies',
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
		'MovieScribe.Controllers',
		'angular-velocity',
		'ngAnimate',
		'ngCookies'
	]);
});