'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var histories = require('../../app/controllers/histories');

	// Histories Routes
	app.route('/histories')
		.get(histories.list)
		.post(users.requiresLogin, histories.create);

	app.route('/histories/:historyId')
		.get(histories.read)
		.put(users.requiresLogin, histories.hasAuthorization, histories.update)
		.delete(users.requiresLogin, histories.hasAuthorization, histories.delete);

	// Finish by binding the History middleware
	app.param('historyId', histories.historyByID);
};