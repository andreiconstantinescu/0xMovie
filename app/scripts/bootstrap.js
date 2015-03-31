/**
 * Created by Gabriel on 31/03/15.
 */

define([
	'require',
	'angular',
	'app',
	'routes'
], function (require, ng) {
	'use strict';
	
	require(['domReady'], function (document) {
		ng.bootstrap(document, ['MovieScribe']);
	});
});