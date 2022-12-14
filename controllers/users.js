const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handleError } = require('../errors/handleError');

const statusCode = {
  ok: 200,
  created: 201,
};

// получение всех пользователей
const getAllUsers = async (req, res) => {
  console.log('getAllUsers');
  try {
    const users = await User.find({});
    res.status(statusCode.ok).send(users);
  } catch (err) {
    handleError(err, res);
  }
};

// получение пользователя по id
const getUser = async (req, res) => {
  console.log('getUser');
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('Ошибка 404. Пользователь не найден');
      err.name = 'NotFoundError';
      handleError(err, res);
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    handleError(err, res);
  }
};

// создание пользователя
const createUser = async (req, res) => {
  console.log('createUser');
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const passHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: passHash,
      name,
      about,
      avatar,
    });
    res.status(statusCode.created).send(user);
  } catch (err) {
    handleError(err, res);
  }
};

// обновление данных пользователя
const updateUser = async (req, res) => {
  console.log('updateUser');
  const { name, about } = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      ownerId,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      const err = new Error('Ошибка 404. Пользователь не найден');
      err.name = 'NotFoundError';
      handleError(err, res);
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    handleError(err, res);
  }
};

// обновление аватара пользователя
const updateAvatar = async (req, res) => {
  console.log('updateAvatar');
  const { avatar } = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      ownerId,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      const err = new Error('Ошибка 404. Пользователь не найден');
      err.name = 'NotFoundError';
      handleError(err, res);
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
