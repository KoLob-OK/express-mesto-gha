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
    res.status(200).send(card);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка при обработке внутри сервера' });
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

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
};
