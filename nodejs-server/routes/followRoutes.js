const express = require('express');
const router = express.Router();

const followCtrl = require('../controllers/followCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.post('/follow/followUser', VerifySession, followCtrl.FollowUser);
router.post('/follow/unFollowUser', VerifySession, followCtrl.UnFollowUser);
router.post('/follow/markOrDeleteNotification/:id', VerifySession, followCtrl.MarkOrDeleteNotification);
router.post('/follow/markAllNotificationsAsRead', VerifySession, followCtrl.markAllNotificationsAsRead);

module.exports = router;