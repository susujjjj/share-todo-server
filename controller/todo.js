import * as todoRepository from '../data/todo.js';
import { getSocketIO } from '../connection/socket.js';

export async function getPosts(req, res) {
  const username = req.query.username;
  const data = await (username
    ? todoRepository.getAllByUsername(username)
    : todoRepository.getAll());
  res.status(200).json(data);
}

export async function getTodo(req, res, next) {
  const id = req.params.id;
  const todo = await todoRepository.getById(id);
  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).json({ message: `todo id(${id}) not found` });
  }
}

export async function createTodo(req, res, next) {
  const { text, isCompleted } = req.body;
  const todo = await todoRepository.create(text, req.userId, isCompleted);
  res.status(201).json(todo);
  getSocketIO().emit('posts', todo);
}

export async function updateTodo(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const completed = req.body.isCompleted;
  const todo = await todoRepository.getById(id);
  if (!todo) {
    return res.status(404).json({ message: `Todo Memo not found: ${id}` });
  }
  if (todo.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await todoRepository.update(id, text, completed); // completed
  res.status(200).send(updated);
}

export async function doneTodo(req, res, next) {
  // console.log(req, 'req!!!?')
  const id = req.params.id;
  const text = req.body.text;
  const completed = req.body.isCompleted;
  const todo = await todoRepository.getById(id);
  if (!todo) {
    return res.status(404).json({ message: `Todo Memo not found: ${id}` });
  }
  if (todo.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const todoCompleted = await todoRepository.done(id, text, completed);
  res.status(200).send(todoCompleted);
}

export async function deleteTodo(req, res, next) {
  const id = req.params.id;
  const todo = await todoRepository.getById(id);
  if (!todo) {
    return res.status(404).json({ message: `Todo Memo not found: ${id}` });
  }
  if (todo.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await todoRepository.remove(id);
  res.sendStatus(204);
}
