module.exports = (app, mongoose) => {
	var orderSchema = new mongoose.Schema({
		orderAmount: Number,
		orderItems: [],
		createdAt: {
			type: Date,
			default: new Date()
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
	});
	orderSchema.plugin(require('./plugins/pagedFind'));
	app.db.model('Orders', orderSchema);
}