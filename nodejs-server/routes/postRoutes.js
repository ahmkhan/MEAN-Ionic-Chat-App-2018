const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/postCtrl');
const VerifySession = require('../helpers/verifySession').verifySession;

router.get('/post/get-all-posts', VerifySession, postCtrl.GetAllPost);
router.post('/post/add-post', VerifySession, postCtrl.AddPost);
router.post('/post/like-post', VerifySession, postCtrl.LikePost);
router.post('/post/add-comment', VerifySession, postCtrl.AddComment);
router.get('/post/:id', VerifySession, postCtrl.GetSinglePost);

module.exports = router;