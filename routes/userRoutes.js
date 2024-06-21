const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth, userController.listUser);
router.put('/', auth, userController.updateUser);
router.delete('/', auth, userController.deleteUser);
router.get('/accountNumber/:accountNumber', auth, userController.getUserByAccountNumber);
router.get('/registrationNumber/:registrationNumber', auth, userController.getUserByRegistrationNumber);

module.exports = router;
