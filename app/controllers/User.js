module.exports.addUser = (req, res) =>{
	let user = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	};
	if(!user.email){
		return res.json({
			'status': false,
			'message': 'Email is required!'
		})
	}
	if(!user.password || user.password.length > 6){
		return res.json({
			'status': false,
			'message': 'Plase enter valid password'
		})
	}
	const SALT_FACTOR = 5
	req.app.bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
		if(error){
			return res.json({
				'status': false,
				'message': 'Could not generate salt!'
			});
		}
		req.app.bcrypt.hash(user.password, salt, (hashError, hash) => {
			if(hashError){
				return res.json({
					'status': false,
					'message': 'Could not generate hash!'
				});
			}
			user.password = hash;
			req.app.db.models.User.create(user, (userError, userData) =>{
				if(userError){
					return res.json({
						'status': false,
						'message': 'Could not create user!'
					});
				}
				return res.json({
					'status': true,
					'message': 'User created successfully!'
				});
			});
		});
	});
};

module.exports.userLogin = (req, res) =>{
	let user = {
		email: req.body.email,
		password: req.body.password
	};

	if(!user.email || !user.password){
		return res.json({
			'status': false,
			'message': 'All fields are mandatory!'
		});
	}
	req.app.db.models.User.findOne({ email: user.email }, (findError, userData) => {
		if(findError){
			return res.json({
				'status': false,
				'message': 'User find error'
			});
		}
		if(!user){
			return res.json({
				'status': false,
				'message': 'Please enter valid login credentials'
			});
		}
		if(req.app.bcrypt.compareSync(user.password, userData.password)){
			let payload = {
				email: userData.email,
				name: userData.name,
				created: Date.now()
			};
			let token = req.app.jwt.sign(payload, req.app.config.jwtSecret);
			return res.json({
				'status': true,
				'email': payload.email,
				'message': 'login successful',
				'token': token
			});
		}
		else{
			return res.json({
				'status': false,
				'message': 'Please enter valid login credentials'
			});
		}
	})
}