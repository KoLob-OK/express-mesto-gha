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
    console.error(err);
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
  }
};

// получение пользователя по id
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'Ошибка. Пользователь не найден' });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
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
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).send({ message: errors.join(', ') });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
};
