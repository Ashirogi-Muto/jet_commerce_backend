module.exports = (app, mongoose) => {
	var userSchema = new mongoose.Schema({
		name: String,
		password: String,
		email: String,
		createdAt: {
			type: Date,
			default: new Date()
		}
	});
	userSchema.plugin(require('./plugins/pagedFind'));
	app.db.model('User', userSchema);
}