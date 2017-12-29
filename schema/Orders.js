module.exports = (app, mongoose) => {
	var orderSchema = new mongoose.Schema({
		orderAmount: Number,
		orderItems: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Products'
		},
		createdAt: {
			type: Date,
			default: new Date()
		}
	});
	orderSchema.plugin(require('./plugins/pagedFind'));
	app.db.model('Orders', orderSchema);
}