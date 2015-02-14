angular.module('app', ['google.plus.auth'])
	.config(['googlePlusAuthProvider', function (googlePlusAuthProvider) {
		googlePlusAuthProvider.config({
			clientId: 'your client id'
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
