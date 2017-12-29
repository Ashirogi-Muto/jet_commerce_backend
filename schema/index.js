module.exports = (app, mongoose) => {
	require('./Orders')(app, mongoose);	
	require('./Products')(app, mongoose);
	require('./User')(app, mongoose);	
}