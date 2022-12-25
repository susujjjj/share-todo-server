import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import * as todoController from '../controller/todo.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const validateTodo = [
  body('text'),
  // .trim()
  // .isLength({ min: 3 })
  // .withMessage('text should be at least 3 characters'),
  validate,
];

// GET /posts?username=:username
router.get('/', isAuth, todoController.getPosts);

// GET /posts/:id
router.get('/:id', isAuth, todoController.getPosts);

// POST /posts
router.post('/', isAuth, validateTodo, todoController.createTodo);

// PUT /posts/:id
router.put('/:id', isAuth, validateTodo, todoController.updateTodo);

// PUT /posts/:id
router.put('/:id', isAuth, validateTodo, todoController.doneTodo);

// DELETE /posts/:id
router.delete('/:id', isAuth, todoController.deleteTodo);

export default router;
