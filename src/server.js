const app = require('./');

app.listen(3333).on('listening', () => {
	console.log('🚀 Server started on port 3333!');
});
