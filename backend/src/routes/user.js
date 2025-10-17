const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { getPublicKey } = require('../utils/crypto');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/stats', userController.getUserStats);
router.post('/createdefaultuser', userController.createdefaultuser);
router.get('/export', userController.exportUsers);
router.get('/public-key', (req, res) => {
  res.json({ publicKey: getPublicKey() });
});
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;