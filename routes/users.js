const router = require('express').Router();

const {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:userId', getUser);

router.get('/me', getCurrentUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
