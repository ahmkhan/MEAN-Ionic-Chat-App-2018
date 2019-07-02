const express = require('express');
const router = express.Router();

const followCtrl = require('../controllers/followCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.post('/people/followUser', VerifySession, followCtrl.FollowUser);
router.post('/people/unFollowUser', VerifySession, followCtrl.UnFollowUser);

module.exports = router;