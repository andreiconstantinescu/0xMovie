/**
 * Created by Gabriel on 31/03/15.
 */

require.config({
	baseUrl: './scripts',
	paths: {
		'domReady': '../../bower_components/requirejs-domready/domReady',
		'angular': '../../bower_components/angular/angular',
		'angularRoute': '../../bower_components/angular-route/angular-route',
		'uiBootstrap': '../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'angular-velocity': '../../bower_components/angular-velocity/angular-velocity.min'
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angularRoute': ['angular'],
		'uiBootstrap': {
			deps: ['angular']
		}
	},
	priority: ["angular"],
	deps: ['./bootstrap']
});