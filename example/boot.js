(function () {
	var app = angular.module('app');
	var user = {};
	var clientId = '426819723405-ahc26ej8cl0fmb3vjds0qr927bu8svlo.apps.googleusercontent.com';
	var cookiePolicy = 'single_host_origin'; // The cookie policy specifies the domains that can access the cookie
	var scope = 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email';
	var responseType = 'token id_token';

	window.googleAuthDone = function () {

		function loadUserProfile() {
			gapi.client.load('oauth2', 'v2', function () {
				gapi.client.oauth2.userinfo.get()
					.execute(function (profile) {
						if (!profile.error) {
							user = {
								profile: profile,
								authType: 'googlePlus',
								loggedIn: true,
							};
						}
						bootstrapApp();
					});
			});
		}

		gapi.auth.authorize({
			immediate: true,
			response_type: responseType,
			client_id: clientId,
			cookie_policy: cookiePolicy,
			scope: scope
		}, function (authResult) {
			var token = gapi.auth.getToken();
			if (authResult.status.signed_in) {
				loadUserProfile();
			} else {
				bootstrapApp();
			}
		});

	};

	function bootstrapApp() {
		localStorage.setItem("google.plus.auth.user", JSON.stringify(user));
		angular.element(document).ready(function () {
			angular.bootstrap(document, ["app"]);
		});
	}
}());
