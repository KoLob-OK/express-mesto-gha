const User = require('../models/user');
const { handleError } = require('../errors/handleError');

// получение всех пользователей
const getAllUsers = async (req, res) => {
  console.log('getAllUsers');
  try {
    const users = await User.find({});
    res.send(users);
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
    res.send(user);
  } catch (err) {
    handleError(err, res);
  }
};

// создание пользователя
const createUser = async (req, res) => {
  console.log('createUser');
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
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
    res.send(user);
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
    res.send(user);
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
