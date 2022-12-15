const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/users');
const cards = require('./routes/cards');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

const statusCode = {
  notFound: 404,
};

app.use(express.json());

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '638cb09f606b39b6002ad781',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);
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
