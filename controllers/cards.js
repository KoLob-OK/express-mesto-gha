const Card = require('../models/card');
const { handleError } = require('../errors/handleError');

// получение всех карточек
const getAllCards = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('getAllCards');
  try {
    const cards = await Card.find({});
    if (cards.length === 0) {
      res.status(404).send({ message: 'Ошибка. Карточки не найдены' });
      return;
    }
    res.status(200).send(cards);
  } catch (err) {
    handleError(err, res);
  }
};

// создание карточки
const createCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('createCard');
  const { name, link } = req.body;
  try {
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    // eslint-disable-next-line no-console
    console.log(card);
    res.status(201).send(card);
  } catch (err) {
    handleError(err, res);
  }
};

// удаление карточки
const deleteCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleteCard');
  const { cardId } = req.params;
  if (cardId.length !== 24) {
    const err = new Error('');
    err.name = 'BadRequestError';
    handleError(err, res);
    return;
  }
  try {
    const card = await Card.findByIdAndRemove(cardId, { new: true });
    if (!card) {
      res.status(404).send({ message: 'Ошибка. Карточка не найдена' });
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    handleError(err, res);
  }
};

// лайк карточки
const likeCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('likeCard');
  const { cardId } = req.params;
  if (cardId.length !== 24) {
    const err = new Error('');
    err.name = 'BadRequestError';
    handleError(err, res);
    return;
  }
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      res.status(404).send({ message: 'Ошибка 404. Карточка не найдена' });
      return;
    }
    res.status(201).send(card);
  } catch (err) {
    handleError(err, res);
  }
};

// удаление лайка карточки
const deleteLike = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleteLike');
  const { cardId } = req.params;
  if (cardId.length !== 24) {
    const err = new Error('');
    err.name = 'BadRequestError';
    handleError(err, res);
    return;
  }
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: ownerId } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      res.status(404).send({ message: 'Ошибка 404. Карточка не найдена' });
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
