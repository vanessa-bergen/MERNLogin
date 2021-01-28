module.exports = function(app) {
	var ctrl = require('./controller.js')();
	app.post('/api/user/register', ctrl.create);
	app.post('/api/user/login', ctrl.login);
	app.put('/api/user/update/:id', ctrl.update);
	app.put('/api/user/updatePassword/:id', ctrl.updatePassword);
	app.get('/api/user/:id', ctrl.getById);
	app.post('/api/user/requestPasswordReset/', ctrl.requestPasswordReset);
	app.post('/api/user/resetPassword/:id/:token', ctrl.resetPassword);
	console.log('user routes initialized');
}