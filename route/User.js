module.exports = (app) => {
	app.put('/login', require(__base + '/app/controllers/User').addUser);
	app.post('/login', require(__base + '/app/controllers/User').userLogin);
	app.get('/user', require(__base + '/app/controllers/User').sendUserData);
	app.post('/cart', require(__base + '/app/controllers/User').createOrder);	
}