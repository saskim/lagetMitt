'use strict';

angular.module('mean.teams').factory('Teams', ['$resource',
  function($resource) {
    return $resource('teams/:teamId', {
      teamId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
