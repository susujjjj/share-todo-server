import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Todo = sequelize.define('todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  //추가
  isCompleted: {
    type: DataTypes.BOOLEAN,
    // defaultValue: false,
    // allowNull: false,
  },
});
Todo.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    'isCompleted',
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.url'), 'url'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export async function getAll() {
  return Todo.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
  return Todo.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id) {
  return Todo.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, userId, isCompleted) {
  return Todo.create({ text, userId, isCompleted }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function update(id, text, isCompleted) {
  return Todo.findByPk(id, INCLUDE_USER) //
    .then((todo) => {
      todo.text = text;
      todo.isCompleted = isCompleted;
      return todo.save();
    });
}

export async function done(id, text, isCompleted) {
  return Todo.findByPk(id, INCLUDE_USER) //
    .then((todo) => {
      todo.text = text;
      todo.isCompleted = isCompleted;

      // console.log(isCompleted, 'isCompleted++++')
      return todo.save();
    });
}

export async function remove(id) {
  return Todo.findByPk(id) //
    .then((todo) => {
      todo.destroy();
    });
}
