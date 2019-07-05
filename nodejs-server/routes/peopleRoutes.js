const express = require('express');
const router = express.Router();

const peopleCtrl = require('../controllers/peopleCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.get('/people/getAllUsers', VerifySession, peopleCtrl.GetAllUsers);
router.get('/people/:id', VerifySession, peopleCtrl.GetUserById);
router.get('/people/userName/:userName', VerifySession, peopleCtrl.GetUserByUserName);

module.exports = router;