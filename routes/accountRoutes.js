const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

router.post('/register', accountController.createAccount);
router.post('/login', accountController.login);
router.get('/profile', auth, accountController.profile);
router.get('/loginsOlderThanThreeDays', auth, accountController.getAccountLoginsOlderThanThreeDays);

module.exports = router;
