module.exports = function(app) {
	var ctrl = require('./controller.js')();
	app.post('/api/user/register', ctrl.create);
	app.post('/api/user/login', ctrl.login);
	console.log('user routes initialized');
}