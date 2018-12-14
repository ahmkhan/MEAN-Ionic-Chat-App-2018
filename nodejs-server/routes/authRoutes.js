const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authCtrl');

router.post('/registerNewUser', authCtrl.registerNewUser);
router.post('/loginUser', authCtrl.loginUser);

module.exports = router;