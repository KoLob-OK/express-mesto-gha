const Card = require('../models/card');

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
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
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
    return res.status(201).send(card);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).send({ message: errors.join(', ') });
  }
};

// удаление карточки
const deleteCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleteCard');
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(404).send({ message: 'Ошибка. Карточка не найдена' });
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
  }
};

// лайк карточки
const likeCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('likeCard');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    res.status(201).send(card);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
  }
};

// удаление лайка карточки
const deleteLike = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleteLike');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: ownerId } }, // убрать _id из массива
      { new: true },
    );
    res.status(200).send(card);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
