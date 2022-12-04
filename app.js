const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '638c8b7cd3a5df155d78fee2',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);
app.use((req, res) => res
  .status(404)
  .send({ message: 'Ошибка 404. Введен некорректный адрес' }));

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB!`);
  })
  .catch(() => {
    console.log('Database connection error');
  });

app.listen(PORT, () => {
  console.log(`App  listening on port ${PORT}`);
});
