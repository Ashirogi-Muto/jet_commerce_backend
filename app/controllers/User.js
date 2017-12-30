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
	if(!user.password || user.password.length < 6){
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
	console.log(user);
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
		if(!userData){
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
};

module.exports.sendUserData = (req, res) => {
	let productArray = [
		{
			id: 1,
			name: 'Hustle Crew Neck',
			price: '250.5',
			image: 'http://via.placeholder.com/100x150',
			attributes: {
				size: [
					{
						type: 'S',
						stock: 10
					},
					{
						type: 'M',
						stock: 10
					},
					{
						type: 'XL',
						stock: 10
					}
				],
				stock: 30,
			},
			count: 0
		},
		{
			id: 2,
			name: 'Take a shot flask',
			price: '255',
			image: 'http://via.placeholder.com/100x150',
			attributes: {
				size: [
					{
						type: 'S',
						stock: 5
					},
					{
						type: 'M',
						stock: 4
					},
					{
						type: 'XL',
						stock: 1
					}
				],
				stock: 10,
			},
			count: 0			
		},
		{
			id: 3,			
			name: 'Shopify Hustle Crew Neck',
			price: '300',
			image: 'http://via.placeholder.com/100x150',
			attributes: {
				size: [
					{
						type: 'S',
						stock: 1
					},
					{
						type: 'M',
						stock: 3
					},
					{
						type: 'XL',
						stock: 2
					}
				],
				stock: 5,
			},
			count: 0
			
		},
		{
			id: 4,			
			name: 'Hustle Crew Neck',
			price: '500',
			image: 'http://via.placeholder.com/100x150',
			attributes: {
				size: [
					{
						type: 'S',
						stock: 0
					},
					{
						type: 'M',
						stock: 0
					},
					{
						type: 'XL',
						stock: 0
					}
				],
				stock: 0,
			},
			count: 0
			
		},
		{
			id: 5,			
			name: 'Take a shot flask',
			price: '300',
			image: 'http://via.placeholder.com/100x150',
			attributes: {
				size: [
					{
						type: 'S',
						stock: 15
					},
					{
						type: 'M',
						stock: 15
					},
					{
						type: 'XL',
						stock: 5
					}
				],
				stock: 35,
			},
			count: 0
			
		},
		{
			id: 6,			
			name: 'Shopify Hustle Crew Neck',
			price: '900',
			image: 'http://via.placeholder.com/100x150',
			attributes: {
				size: [
					{
						type: 'S',
						stock: 10
					},
					{
						type: 'M',
						stock: 10
					},
					{
						type: 'XL',
						stock: 10
					}
				],
				stock: 30
			},
			count: 0			
		}
	]
	return res.json({
		'status': true,
		'message': 'success',
		'products': productArray
	});
};

module.exports.createOrder = (req, res) => {
	console.log(req.body);
	let auth = req.get('authorization');
	if(!auth){
		return res.json({
			'status': false,
			'message': 'Not authorized user'
		})
	}
	auth = auth.split(' ');
	let decodedData = req.app.jwt.decode(auth[1]);
	console.log('auth', decodedData);
	req.app.db.models.User.findOne({email: decodedData.email}, (err, user) => {
		if(err){
			return res.json({
				'status': false,
				'message': 'User Not Found'
			})
		}
		let orderData = {
			orderAmount: parseFloat(req.body.finalAmount),
			orderItems: req.body.orderItems,
			user: decodedData._id
		};
		req.app.db.models.Orders.create(orderData, (orderError, orderData) => {
			if(orderError){
				return res.json({
					'status': false,
					'message': 'Could Not Create Order'
				})
			}
			console.log(orderData);
			return res.json({
				'status': true,
				'message': 'Order Created!'
			})
		})
	})
}