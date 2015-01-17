/**
 * Created with by  User: sonja  Date: 30/12/14  Time: 10:38
 */
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Team = mongoose.model('Team'),
    _ = require('lodash');

/**
 * Find team by id
 */
exports.team = function(req, res, next, id) {
    console.log(Team);
    Team.load(id, function(err, team) {
        if (err) return next(err);
        if (!team) return next(new Error('Kunne ikke hente lag ' + id));
        req.team = team;
        next();
    });
};

/**
 * Create a team
 */
exports.create = function(req, res) {
    console.log('create');
    var team = new Team(req.body);
    team.defaultTournament = req.defaultTournament;
    team.adminUser = req.adminUser;

    team.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Kan ikke lagre lag'
            });
        }
        res.json(team);
    });
};

/**
 * Connect to a team
 */


/**
 * Update a team
 */
exports.update = function(req, res) {
    var team = req.team;

    team = _.extend(team, req.body);

    team.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Kan ikke oppdatere lag'
            });
        }
        res.json(team);

    });
};

/**
 * Delete a team
 */
exports.destroy = function(req, res) {
    var team = req.team;

    team.remove(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Kan ikke slette lag'
            });
        }
        res.json(team);

    });
};

/**
 * Show a team
 */
exports.show = function(req, res) {
    res.json(req.team);
};

/**
 * List of all Teams
 */
exports.all = function(req, res) {
    Team.find().sort('-name').populate('tournament', 'name season').exec(function(err, teams) {
        if (err) {
            return res.status(500).json({
                error: 'Kan ikke returnere liste med lag'
            });
        }
        res.json(teams);
    });
};

