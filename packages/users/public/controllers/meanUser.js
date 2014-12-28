'use strict';

angular.module('mean.users')
  .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      // This object will contain list of available social buttons to authorize
      $scope.socialButtonsCounter = 0;
      $scope.global = Global;

      $http.get('/get-config')
        .success(function(config) {
          $scope.socialButtons = config;
        });
    }
  ])
  .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      // This object will be filled by the form
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.input = {
        type: 'password',
        placeholder: 'Passord',
        confirmPlaceholder: 'Repeter passord',
        iconClass: '',
        tooltipText: 'Vis passord'
      };

      $scope.togglePasswordVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholder = $scope.input.placeholder === 'Passord' ? 'Synlig passord' : 'Passord';
        $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipText = $scope.input.tooltipText === 'Vis passord' ? 'Skjul passord' : 'Vis passord';
      };

      // Register the login() function
      $scope.login = function() {
        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
            // authentication OK
            $scope.loginError = 0;
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function() {
            $scope.loginerror = 'Autentisering feilet.';
          });
      };
    }
  ])
  .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = true;
      $scope.input = {
        type: 'password',
        placeholder: 'Passord',
        placeholderConfirmPass: 'Repeter passord',
        iconClassConfirmPass: '',
        tooltipText: 'Vis passord',
        tooltipTextConfirmPass: 'Vis passord'
      };

      $scope.togglePasswordVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholder = $scope.input.placeholder === 'Passord' ? 'Synlig passord' : 'Passord';
        $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipText = $scope.input.tooltipText === 'Vis passord' ? 'Skjul passord' : 'Vis passord';
      };
      $scope.togglePasswordConfirmVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholderConfirmPass = $scope.input.placeholderConfirmPass === 'Repeter passord' ? 'Synlig passord' : 'Repeter passord';
        $scope.input.iconClassConfirmPass = $scope.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipTextConfirmPass = $scope.input.tooltipTextConfirmPass === 'Vis passord' ? 'Skjul passord' : 'Vis passord';
      };

      $scope.register = function() {
        $scope.usernameError = null;
        $scope.registerError = null;
        $http.post('/register', {
          email: $scope.user.email,
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword,
          username: $scope.user.username,
          name: $scope.user.name
        })
          .success(function() {
            // authentication OK
            $scope.registerError = 0;
            $rootScope.user = $scope.user;
            Global.user = $rootScope.user;
            Global.authenticated = !! $rootScope.user;
            $rootScope.$emit('loggedin');
            $location.url('/');
          })
          .error(function(error) {
            // Error: authentication failed
            if (error === 'Brukernavn er opptatt') {
              $scope.usernameError = error;
            } else if (error === 'E-post er opptatt') {
              $scope.emailError = error;
            } else $scope.registerError = error;
          });
      };
    }
  ])
  .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.forgotpassword = function() {
        $http.post('/forgot-password', {
          text: $scope.user.email
        })
          .success(function(response) {
            $scope.response = response;
          })
          .error(function(error) {
            $scope.response = error;
          });
      };
    }
  ])
  .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global',
    function($scope, $rootScope, $http, $location, $stateParams, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.resetpassword = function() {
        $http.post('/reset/' + $stateParams.tokenId, {
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword
        })
          .success(function(response) {
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function(error) {
            if (error.msg === 'Tokenet er ugyldig eller utløpt')
              $scope.resetpassworderror = 'Kunne ikke oppdatere passord fordi tokenet er ugyldig eller er utløpt';
            else
              $scope.validationError = error;
          });
      };
    }
  ]);
