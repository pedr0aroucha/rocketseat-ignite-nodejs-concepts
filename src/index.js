// @ts-check

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { resolve } = require('path');

const controllers = require('./controllers/index.js');

const app = express();

app.use(cors());
app.use(express.json());

function checksExistsUserAccount(request, response, next) {
	const users = JSON.parse(
		fs.readFileSync(resolve(__dirname, 'database', 'users.json'), 'utf-8')
	);

	const { username } = request.headers;

	if (!username)
		return response.status(400).json({ error: 'Missing username' });

	const user = users.find((user) => user.username === username);

	if (!user)
		return response
			.status(400)
			.json({ error: 'User account does not exists.' });

	next();
}

app.post('/users', controllers.createUsers);

app.get('/todos', checksExistsUserAccount, controllers.listTodos);

app.post('/todos', checksExistsUserAccount, controllers.addTodoToUser);

app.put('/todos/:id', checksExistsUserAccount, controllers.updateTodo);

app.patch(
	'/todos/:id/done',
	checksExistsUserAccount,
	controllers.markTodoAsDone
);

app.delete('/todos/:id', checksExistsUserAccount, controllers.deleteTodo);

module.exports = app;
