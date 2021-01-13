module.exports = function(app) {
	var ctrl = require('./controller.js')();
	app.post('/register', ctrl.create);
	app.post('/login', ctrl.login);
	console.log('user routes initialized');
}