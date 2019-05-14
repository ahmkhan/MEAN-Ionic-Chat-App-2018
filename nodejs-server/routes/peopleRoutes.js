const express = require('express');
const router = express.Router();

const peopleCtrl = require('../controllers/peopleCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.get('/people/getAllUsers', VerifySession, peopleCtrl.GetAllUsers);

module.exports = router;