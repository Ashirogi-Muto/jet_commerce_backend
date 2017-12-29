module.exports = (app, mongoose) => {
	var userSchema = new mongoose.Schema({
		name: String,
		password: String,
		email: String,
		orders: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Orders'
		},
		createdAt: {
			type: Date,
			default: new Date()
		}
	});
	userSchema.plugin(require('./plugins/pagedFind'));
	app.db.model('User', userSchema);
}