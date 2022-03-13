// @ts-check

const fs = require('fs');
const { resolve } = require('path');

exports.find = () =>
	JSON.parse(
		fs.readFileSync(
			resolve(__dirname, '..', 'database', 'users.json'),
			'utf-8'
		)
	);

exports.save = (users) =>
	fs.writeFileSync(
		resolve(__dirname, '..', 'database', 'users.json'),
		JSON.stringify(users, null, 2)
	);
