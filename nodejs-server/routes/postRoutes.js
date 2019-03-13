const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/postCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.get('/post/get-all-posts', VerifySession, postCtrl.GetAllPost);
router.post('/post/add-post', VerifySession, postCtrl.AddPost);

module.exports = router;