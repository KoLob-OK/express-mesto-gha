const User = require('../models/user');
const { handleError } = require('../errors/handleError');

// получение всех пользователей
const getAllUsers = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('getAllUsers');
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send({ message: 'Ошибка. Пользователи не найдены' });
      return;
    }
    res.status(200).send(users);
  } catch (err) {
    handleError(err, res);
  }
};

// получение пользователя по id
const getUser = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('getUser');
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'Ошибка. Пользователь не найден' });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    handleError(err, res);
  }
};

// создание пользователя
const createUser = async (req, res) => {
  // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
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
    res.status(200).send(user);
  } catch (err) {
    handleError(err, res);
  }
};

// обновление аватара пользователя
const updateAvatar = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('updateAvatar');
  const avatar = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      ownerId,
      avatar,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(user);
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
