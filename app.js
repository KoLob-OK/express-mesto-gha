const express = require('express');
/* const mongoose = require('mongoose');
const path = require('path'); */

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App  listening on port ${PORT}`);
});
