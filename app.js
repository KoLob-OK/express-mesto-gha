const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '638b9d12a110677f1c63cda9',
  };

  next();
});

app.use('/', users);
app.use('/', cards);
app.use((req, res) => res
  .status(404)
  .send({ message: 'Ошибка 404. Введен некорректный адрес' }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App  listening on port ${PORT}`);
  });
});
