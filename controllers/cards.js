const Card = require('../models/card');
const { handleError } = require('../errors/handleError');

const statusCode = {
  ok: 200,
  created: 201,
};

// получение всех карточек
const getAllCards = async (req, res) => {
  console.log('getAllCards');
  try {
    const cards = await Card.find({}).populate('owner');
    res.status(statusCode.ok).send(cards);
  } catch (err) {
    handleError(err, res);
  }
};

// создание карточки
const createCard = async (req, res) => {
  console.log('createCard');
  const { name, link } = req.body;
  try {
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    console.log(card);
    res.status(statusCode.created).send(card);
  } catch (err) {
    handleError(err, res);
  }
};

// удаление карточки
const deleteCard = async (req, res) => {
  console.log('deleteCard');
  const { cardId } = req.params;
  const { userId } = req.user._id;
  try {
    const card = await Card
      .findById(cardId)
      .populate('owner');
    if (!card) {
      const err = new Error('Ошибка 404. Карточка не найдена');
      err.name = 'NotFoundError';
      handleError(err, res);
      return;
    }
    const ownerId = card.owner.id;
    if (ownerId !== userId) {
      const err = new Error('Ошибка 403. Удаление чужой карточки запрещено');
      err.name = 'ForbiddenError';
      handleError(err, res);
      return;
    }
    await Card.findByIdAndRemove(cardId);
    res.status(statusCode.ok).send(card);
  } catch (err) {
    err.name = 'ForbiddenError';
    handleError(err, res);
  }
};

// лайк карточки
const likeCard = async (req, res) => {
  console.log('likeCard');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card
      .findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: ownerId } }, // добавить _id в массив, если его там нет
        { new: true },
      )
      .populate(['owner', 'likes']);
    if (!card) {
      const err = new Error('Ошибка 404. Карточка не найдена');
      err.name = 'NotFoundError';
      handleError(err, res);
      return;
    }
    res.status(statusCode.ok).send(card);
  } catch (err) {
    handleError(err, res);
  }
};

// удаление лайка карточки
const deleteLike = async (req, res) => {
  console.log('deleteLike');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card
      .findByIdAndUpdate(
        cardId,
        { $pull: { likes: ownerId } }, // убрать _id из массива
        { new: true },
      )
      .populate(['owner', 'likes']);
    if (!card) {
      const err = new Error('Ошибка 404. Карточка не найдена');
      err.name = 'NotFoundError';
      handleError(err, res);
      return;
    }
    res.status(statusCode.ok).send(card);
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
