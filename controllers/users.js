const User = require('../models/user');

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
    // eslint-disable-next-line no-console
    console.log(users);
    res.status(200).send(users);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
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
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).send({ message: 'Ошибка. Введен некорректный Id пользователя' });
  }
};

// создание пользователя
const createUser = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('createUser');
  const { name, about, avatar } = req.body;
  // eslint-disable-next-line no-console
  console.log({ name, about, avatar });
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).send({ message: errors.join(', ') });
  }
};

// обновление данных пользователя
const updateUser = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('updateUser');
  const { name, about } = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(ownerId, { name, about }, { new: true });
    res.status(200).send(user);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).send({ message: 'Ошибка в запросе' });
  }
};

// обновление аватара пользователя
const updateAvatar = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('updateAvatar');
  const avatar = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(ownerId, avatar, { new: true });
    res.status(200).send(user);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).send({ message: 'Ошибка в запросе' });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
