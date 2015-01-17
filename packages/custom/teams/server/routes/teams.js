'use strict';

var teams = require('../controllers/teams');

// Team authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.team.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Teams, app, auth, database) {

  app.route('/teams')
      .get(teams.all)
      .post(auth.requiresLogin, teams.create);
  app.route('/teams/:teamId')
      .get(auth.isMongoId, teams.show)
      .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, teams.update)
      .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, teams.destroy);


  app.param('teamId', teams.team);

  /*app.get('/teams/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/teams/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/teams/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/teams/example/render', function(req, res, next) {
    Teams.render('index', {
      package: 'teams'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });*/
};
