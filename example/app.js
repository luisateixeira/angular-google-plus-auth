angular.module('app', ['google.plus.auth'])
	.config(['googlePlusAuthProvider', function (googlePlusAuthProvider) {
		googlePlusAuthProvider.config({
			clientId: '426819723405-ahc26ej8cl0fmb3vjds0qr927bu8svlo.apps.googleusercontent.com'
		});
	}])
	.controller('AppCtrl', [
		'$scope',
		'googlePlusAuth',
		'googlePlusUser',
		function ($scope, googlePlusAuth, googlePlusUser) {

			$scope.user = googlePlusUser;

			$scope.login = function () {
				googlePlusAuth.login();
			};

			$scope.logout = function () {
				googlePlusAuth.logout();
			};
		}
	]);
