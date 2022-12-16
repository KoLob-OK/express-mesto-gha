const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors, Joi } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

const statusCode = {
  notFound: 404,
};

const regexUrl = /http(s?):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+)/;

app.use(express.json());

// роуты, не требующие авторизации (регистрация и логин)
app.post('/signin', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexUrl),
  }),
}), createUser);
// роуты, которым авторизация нужна
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res) => res
  .status(statusCode.notFound)
  .send({ message: 'Ошибка 404. Введен некорректный адрес' }));

app.use(errors());

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(() => {
    console.log('Database connection error');
  });

app.listen(PORT, () => {
  console.log(`App  listening on port ${PORT}`);
});
