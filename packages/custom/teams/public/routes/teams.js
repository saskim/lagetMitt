'use strict';

angular.module('mean.teams').config(['$stateProvider',
  function($stateProvider) {

    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $stateProvider
      .state('teams', {
        url: '/teams',
        templateUrl: 'teams/views/list.html'
      })
      .state('connect to team', {
        url: '/teams/connect',
        templateUrl: 'teams/views/connect.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create team', {
        url: '/teams/create',
        templateUrl: 'teams/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit team', {
        url: '/teams/:teamId/edit',
        templateUrl: 'teams/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('team by id', {
        url: '/teams/:teamId',
        templateUrl: 'teams/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
