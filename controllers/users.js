const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleError } = require('../errors/handleError');

const { NODE_ENV, JWT_SECRET } = process.env;
console.log(process.env.NODE_ENV);

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

// получение инфо о текущем пользователе
const getCurrentUser = async (req, res) => {
  console.log('getCurrentUser');
  const { userId } = req.user._id;
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
  if (!email || !password) {
    const err = new Error('Ошибка 400. Неправильные почта или пароль');
    err.name = 'ValidationError';
    handleError(err, res);
    return;
  }
  try {
    const passHash = await bcrypt.hash(password, 10);
    const checkUserDuplication = await User.findOne({ email });
    if (checkUserDuplication) {
      const err = new Error(`Ошибка 409. Пользователь ${email} уже существует`);
      err.name = 'ConflictError';
      handleError(err, res);
      return;
    }
    const user = await User.create({
      email,
      password: passHash,
      name,
      about,
      avatar,
    });
    res.status(statusCode.created).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    handleError(err, res);
  }
};

// аутентификация пользователя
const login = async (req, res) => {
  console.log('login');
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);

    // если найден, создаем токен
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
      { expiresIn: '7d' },
    );

    // вернём токен, браузер сохранит его в куках
    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      // если у ответа нет тела, то используем метод end
      .end();
  } catch (err) {
    err.name = 'UnauthorizedError';
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
  getCurrentUser,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
