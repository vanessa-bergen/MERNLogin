module.exports = function(app) {
	var ctrl = require('./controller.js')();
	app.post('/register', ctrl.create);
	console.log('user routes initialized');
}