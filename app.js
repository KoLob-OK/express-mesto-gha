const express = require('express');
const mongoose = require('mongoose');

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

app.use(express.json());

// роуты, не требующие авторизации (регистрация и логин)
app.post('/signin', login);
app.post('/signup', createUser);
// роуты, которым авторизация нужна
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res) => res
  .status(statusCode.notFound)
  .send({ message: 'Ошибка 404. Введен некорректный адрес' }));

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
