// @ts-check

const { v4: uuidv4 } = require('uuid');

const UsersRepository = require('../repository/UsersRepository');

exports.createUsers = async (request, response) => {
	const users = UsersRepository.find();

	const userAccountAlreadyExists =
		users.filter((user) => user.username === request.body.username).length >
		0;

	if (userAccountAlreadyExists)
		return response
			.status(400)
			.json({ error: 'User account already exists.' });

	const { name, username } = request.body;

	const user = {
		id: uuidv4(),
		name,
		username,
		todos: [],
	};

	users.push(user);

	UsersRepository.save(users);

	return response.status(201).json(user);
};

exports.addTodoToUser = async (request, response) => {
	const users = UsersRepository.find();

	const { title, deadline } = request.body;
	const { username } = request.headers;

	const user = users.find((user) => user.username === username);

	if (!user)
		return response
			.status(400)
			.json({ error: 'User account does not exists.' });

	const todo = {
		id: uuidv4(),
		title,
		deadline: deadline || new Date().toISOString(),
		done: false,
		created_at: new Date().toISOString(),
	};

	user.todos.push(todo);

	UsersRepository.save(users);

	return response.status(201).json(todo);
};

exports.listTodos = async (request, response) => {
	const users = UsersRepository.find();

	const { username } = request.headers;

	const user = users.find((user) => user.username === username);

	if (!user)
		return response
			.status(400)
			.json({ error: 'User account does not exists.' });

	return response.status(200).json(user.todos);
};

exports.updateTodo = async (request, response) => {
	const users = UsersRepository.find();

	const { username } = request.headers;

	const user = users.find((user) => user.username === username);

	if (!user)
		return response
			.status(400)
			.json({ error: 'User account does not exists.' });

	const { id } = request.params;

	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo) return response.status(404).json({ error: 'Todo not found.' });

	const { title, deadline, done } = request.body;

	todo.title = title || todo.title;
	todo.deadline = deadline || todo.deadline;
	todo.done = done || todo.done;

	UsersRepository.save(users);

	return response.status(200).json(todo);
};

exports.markTodoAsDone = async (request, response) => {
	const users = UsersRepository.find();

	const { username } = request.headers;

	const user = users.find((user) => user.username === username);

	if (!user)
		return response
			.status(400)
			.json({ error: 'User account does not exists.' });

	const { id } = request.params;

	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo) return response.status(404).json({ error: 'Todo not found.' });

	todo.done = true;

	UsersRepository.save(users);

	return response.status(200).json(todo);
};

exports.deleteTodo = async (request, response) => {
	const users = UsersRepository.find();

	const { username } = request.headers;

	const user = users.find((user) => user.username === username);

	if (!user)
		return response
			.status(400)
			.json({ error: 'User account does not exists.' });

	const { id } = request.params;

	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo) return response.status(404).json({ error: 'Todo not found.' });

	user.todos = user.todos.filter((todo) => todo.id !== id);

	UsersRepository.save(users);

	return response.status(204).json();
};
