# Angular Google+ Sign in

Angularjs provider for Google+ sign in using the OAuth 2.0 authorization protocol.

#### [Demo](http://www.luisateixeira.com/angular-google-plus-auth)

## Install

```bash
bower install angular-google-plus-auth
```

## Usage
Include the google javascript API. You can define an onload callback that will execute when the script has successfully loaded.
```html
<script type="text/javascript">
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:platform.js?onload=googleAuthDone';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    </script>
```
Configure the provider with your OAuth 2.0 client id and use it on your controller.
Note: The logout() may not work on localhost unless you map the domain in /etc/hosts.
```javascript
angular.module('app', ['google.plus.auth'])
    .config(['googlePlusAuthProvider', function (googlePlusAuthProvider) {
        googlePlusAuthProvider.config({
            clientId: 'your OAuth 2.0 client ID'
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
```
```html
<div class="google-auth-box" ng-controller='AppCtrl'>
    <div ng-if="!user.loggedIn">
        <div>Hello <span class="highlight">Stranger</span>!</div>
        <button class="google-button" ng-click=login()>Sign in with Google</button>
    </div>

    <div ng-if="user.loggedIn">
        <div>Hello <span class="highlight">{{user.profile.given_name}}</span>!</div>
        <button class="google-button" ng-click=logout()>Sign out</button>
    </div>
</div>
```
