const statusCode = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
};

const handleError = (err, res) => {
  if (err.name === 'CastError') {
    return res
      .status(statusCode.badRequest)
      .send({ message: `Ошибка ${statusCode.badRequest}. Некорректный запрос` });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(statusCode.badRequest)
      .send({ message: `Ошибка ${statusCode.badRequest}. Введены некорректные данные` });
  }
  if (err.name === 'NotFoundError') {
    return res
      .status(statusCode.notFound)
      .send({ message: err.message });
  }

  return res
    .status(statusCode.internalServerError)
    .send({ message: `Ошибка ${statusCode.internalServerError}. Произошла ошибка при обработке внутри сервера` });
};

module.exports = {
  handleError,
};
