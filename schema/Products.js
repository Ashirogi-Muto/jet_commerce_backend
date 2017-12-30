module.exports = (app, mongoose) => {
	var productSchema = new mongoose.Schema({
		name: String,
		description: String,
		price: String,
		image: String
	});
	productSchema.plugin(require('./plugins/pagedFind'));
	app.db.model('Products', productSchema);
}