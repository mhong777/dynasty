'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var owners = require('../../app/controllers/owners');

	// Owners Routes
	app.route('/owners')
		.get(owners.list)
		.post(users.requiresLogin, owners.create);

	app.route('/owners/:ownerId')
		.get(owners.read)
		.put(users.requiresLogin, owners.hasAuthorization, owners.update)
		.delete(users.requiresLogin, owners.hasAuthorization, owners.delete);
    
    app.route('/ownerUpdate')
        .put(owners.update);

    app.route('/alterRoster/:ownerId')
        .put(owners.alterRoster);
    
    app.route('/spotChange/:ownerId')
        .put(owners.spotChange);
    
    app.route('/changePlayer')
        .put(owners.changePlayer);
    
    app.route('/ownerName/:ownerId')
        .get(owners.getName);

    app.route('/addCutPlayer')
        .put(owners.addCutPlayer);
    
	// Finish by binding the Owner middleware
	app.param('ownerId', owners.ownerByID);
};