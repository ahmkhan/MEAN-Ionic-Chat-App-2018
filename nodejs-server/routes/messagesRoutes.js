const express = require('express');
const router = express.Router();

const messagesCtrl = require('../controllers/messagesCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.get('/get-messages/:senderId/:receiverId', VerifySession, messagesCtrl.getMessages);
router.post('/send-messages/:senderId/:receiverId', VerifySession, messagesCtrl.sendMessages);

module.exports = router;