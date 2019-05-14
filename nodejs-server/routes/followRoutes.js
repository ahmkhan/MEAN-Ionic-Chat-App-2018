const express = require('express');
const router = express.Router();

const followCtrl = require('../controllers/followCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.get('/people/followUser', VerifySession, followCtrl.FollowUser);

module.exports = router;