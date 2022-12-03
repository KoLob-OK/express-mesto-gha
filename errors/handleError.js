const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;

const handleError = (err, res) => {
  if (err.name === 'BadRequestError') {
    return res
      .status(ERROR_BAD_REQUEST)
      .send({ message: `Ошибка ${ERROR_BAD_REQUEST}. Некорректный запрос` });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(ERROR_BAD_REQUEST)
      .send({ message: `Ошибка ${ERROR_BAD_REQUEST}. Введены некорректные данные` });
  }
  if (err.name === 'NotFoundError') {
    return res
      .status(ERROR_NOT_FOUND)
      .send({ message: err.message });
  }

  return res
    .status(ERROR_INTERNAL_SERVER)
    .send({ message: `Ошибка ${ERROR_INTERNAL_SERVER}. Произошла ошибка при обработке внутри сервера` });
};

module.exports = {
  handleError,
};
