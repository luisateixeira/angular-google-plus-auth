/*! angular-google-plus-auth - v0.1.0 2015-02-15 */
angular.module("google.plus.auth", []).factory("googlePlusUser", function() {
    var storageUser = JSON.parse(localStorage.getItem("google.plus.auth.user")) || {};
    return angular.extend({}, {
        profile: null,
        loggedIn: false,
        authType: null
    }, storageUser);
}).provider("googlePlusAuth", function() {
    var clientId;
    var cookiePolicy = "single_host_origin";
    var scope = "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email";
    var responseType = "token id_token";
    var authDeferred;
    var profileDeferred;
    /**
         * config - Provider configuration
         *
         * @param  {Object} options An object with the configuration attributes
         * @param  {String} options.clientId Required. OAuth 2.0 client ID
         * @param  {String} options.cookiePolicy Optional. The cookie policy specifies the domains that can access the cookie.
         *                                       The default value is single_host_origin.
         *                                       More information at https://developers.google.com/+/web/signin/reference#determining_a_value_for_cookie_policy
         * @param  {String} options.scope Optional. A space-delimited list of scope URIs. The default values are plus.login and userinfo.email.
         *                                More information at https://developers.google.com/+/api/oauth#scopes
         */
    function config(options) {
        if (!options) {
            throw new Error("Google Auth Provider - config() - The options parameter is required");
        }
        if (!options.clientId) {
            throw new Error("Google Auth Provider - config() - The clientId key is required");
        }
        clientId = options.clientId;
        cookiePolicy = options.cookiePolicy || cookiePolicy;
        scope = options.scope || scope;
    }
    return {
        config: config,
        $get: [ "$rootScope", "$q", "googlePlusUser", function($rootScope, $q, googlePlusUser) {
            /**
                     * login - Initiates the OAuth 2.0 authorization process and gets the user info.
                     * @return {Promise}  A promise that, once resolved, returns an object with the user profile and login status.
                     *                    If the promise is rejected, it returns the error.
                     */
            function login() {
                return getAuth(false).then(getUserProfile).catch(handleError);
            }
            /**
                     * logout - Signs a user out without logging the user out of Google.
                     *          After sign in out, it makes a authorize request to verify the sucefull logout.
                     * @return {Promise}  A promise that, once resolved or rejected, returns an object with the authorization result.
                     */
            function logout() {
                if (gapi.auth.getToken() && gapi.auth.getToken().status.signed_in) {
                    gapi.auth.signOut();
                    return getAuth(true);
                }
                return handleError("User is already logged out");
            }
            /**
                     * getAuth - Initiates the OAuth 2.0 authorization process. If the immediate params is passed as false,
                     *           the browser displays a popup window prompting the user authenticate and authorize.
                     *
                     * @param  {Boolean} immediate If true, then login uses "immediate mode", which means that the token is
                     *                             refreshed behind the scenes, and no UI is shown to the user.
                     * @return {Promise}           A promise that, once resolved or rejected, returns an object with the authorization result.
                     */
            function getAuth(immediate) {
                if (!clientId) {
                    throw new Error("Google Auth Provider - The clientId is not defined. Please define it in configuration options");
                }
                authDeferred = $q.defer();
                gapi.auth.authorize({
                    immediate: immediate,
                    response_type: responseType,
                    client_id: clientId,
                    cookie_policy: cookiePolicy,
                    scope: scope
                }, handleAuth);
                return authDeferred.promise;
            }
            /**
                     * getUserProfile - Get the public profile information. The information available
                     *                  depends on the scope defined when configuring this provided
                     *
                     * @return {Promise}  A promise that, once resolved, returns an object with the user profile.
                     *                    If the promise is rejected, it returns the error.
                     */
            function getUserProfile() {
                profileDeferred = $q.defer();
                gapi.client.load("oauth2", "v2", function() {
                    gapi.client.oauth2.userinfo.get().execute(function(response) {
                        if (response.error) {
                            profileDeferred.reject(response.error);
                        }
                        profileDeferred.resolve(setupUser(response));
                    });
                });
                return profileDeferred.promise;
            }
            /**
                     * handleAuth - Handles the authorization response.
                     *
                     * @param  {Object} authResult The authorization response.
                     */
            function handleAuth(authResult) {
                if (authResult.status.signed_in) {
                    if (authResult.status.method === "PROMPT") {
                        authDeferred.resolve(authResult);
                    }
                } else if (authResult.error === "user_signed_out") {
                    resetUser();
                    authDeferred.resolve(authResult);
                } else if (authResult.error !== "immediate_failed") {
                    authDeferred.reject(authResult.error);
                }
                $rootScope.$apply();
            }
            /**
                     * handleError - Resets the user information object and returns a rejected promise.
                     *
                     * @param  {String|Object} error
                     * @return {Promise}    Returns a rejected promise with the error.
                     */
            function handleError(error) {
                resetUser();
                return $q.reject(error);
            }
            /**
                     * resetUser - Resets the user profile and login status
                     *
                     * @return {Object}  An object with user information and login status
                     */
            function resetUser() {
                googlePlusUser.profile = null;
                googlePlusUser.authType = null;
                googlePlusUser.loggedIn = false;
                return googlePlusUser;
            }
            /**
                     * setupUser - Setups the user profile and login status
                     *
                     * @param  {Object} profile The profile information
                     * @return {Object}         An object with user information and login status
                     */
            function setupUser(profile) {
                googlePlusUser.profile = profile;
                googlePlusUser.authType = "googlePlus";
                googlePlusUser.loggedIn = true;
                return googlePlusUser;
            }
            return {
                login: login,
                logout: logout,
                getAuth: getAuth
            };
        } ]
    };
});