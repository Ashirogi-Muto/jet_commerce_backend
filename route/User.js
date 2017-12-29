module.exports = (app) => {
	app.put('/login', require(__base + '/app/controllers/User').addUser);
	app.post('/login', require(__base + '/app/controllers/User').userLogin);	
}