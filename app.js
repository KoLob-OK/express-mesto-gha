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
    _id: '6388aeb7d8868c4e0f588c94',
  };

  next();
});

app.use('/', users);
app.use('/', cards);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log(`App  listening on port ${PORT}`);
  });
});
