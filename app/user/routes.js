module.exports = function(app) {
	var ctrl = require('./controller.js')();
	app.post('/api/user/register', ctrl.create);
	app.post('/api/user/login', ctrl.login);
	app.put('/api/user/update/:id', ctrl.update);
	app.put('/api/user/updatePassword/:id', ctrl.changePassword);
	app.get('/api/user/:id', ctrl.getById);
	console.log('user routes initialized');
}