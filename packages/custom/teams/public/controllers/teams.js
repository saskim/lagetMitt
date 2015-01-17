'use strict';

/* jshint -W098 */
angular.module('mean.teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Global', 'Teams',
  function($scope, $stateParams, $location, Global, Teams) {
    $scope.global = Global;

    $scope.setGender = function (gender) {
      this.gender = gender;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var genderPrefix = (this.gender === 'female') ? 'f' : ((this.gender === 'male') ? 'm' : 'mix');
        switch(this.gender) {
          case 'female':
            genderPrefix = 'f';
            break;
          case 'male':
            genderPrefix = 'm';
            break;
          default: genderPrefix = 'mix';
        }
        var team = new Teams({
          id: genderPrefix + '_' + this.name.toLowerCase(),
          name: this.name,
          created: new Date(),
          gender: this.gender
        });
        team.$save(function(response) {
          $location.path('teams/' + response._id);
        });

        this.name = '';
        this.gender = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(team) {
      if (team) {
        team.$remove(function(response) {
          for (var i in $scope.teams) {
            if ($scope.teams[i] === team) {
              $scope.teams.splice(i, 1);
            }
          }
          $location.path('teams');
        });
      } else {
        $scope.team.$remove(function(response) {
          $location.path('teams');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var team = $scope.team;
        if (!team.updated) {
          team.updated = [];
        }
        team.updated.push(new Date().getTime());

        team.$update(function() {
          $location.path('teams/' + team._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Teams.query(function(teams) {
        $scope.teams = teams;
      });
    };

    $scope.findOne = function() {
      Teams.get({
        teamId: $stateParams.teamId
      }, function(team) {
        $scope.team = team;
      });
    };

  }
]);
