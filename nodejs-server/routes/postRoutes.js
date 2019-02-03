const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/postCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.post('/post/add-post', VerifySession, postCtrl.AddPost);

module.exports = router;