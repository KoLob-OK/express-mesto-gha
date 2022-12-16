const statusCode = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
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
  if (err.name === 'UnauthorizedError') {
    return res
      .status(statusCode.unauthorized)
      .send({ message: `Ошибка ${statusCode.unauthorized}. Неправильные почта или пароль` });
  }
  if (err.name === 'ForbiddenError') {
    return res
      .status(statusCode.forbidden)
      .send({ message: `Ошибка ${statusCode.forbidden}. Недостаточно прав. Доступ запрещен` });
  }
  if (err.name === 'NotFoundError') {
    return res
      .status(statusCode.notFound)
      .send({ message: err.message });
  }
  if (err.name === 'ConflictError') {
    return res
      .status(statusCode.conflict)
      .send({ message: err.message });
  }

  return res
    .status(statusCode.internalServerError)
    .send({ message: `Ошибка ${statusCode.internalServerError}. Произошла ошибка при обработке внутри сервера` });
};

module.exports = {
  handleError,
  statusCode,
};
