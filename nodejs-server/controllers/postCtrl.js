const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PostSchema            = require('../schemas/postModels');
const UserSchema            = require('../schemas/userSchema');


module.exports.AddPost = (req, res) => {
    const postSchemaToRequire = Joi.object().keys({
        Post: Joi.string().required()
    });

    const {error} = Joi.validate(req.body, postSchemaToRequire);

    if (error && error.details) {
        return res.status(HttpStatus.BAD_REQUEST).json({message:'Error In Add Post Schema Validation', errorMsg: error.details})
    }

    const postObj = {
        User: req.user._id,
        UserName: req.user.UserName,
        Post: req.body.Post,
        CreatedAt:  new Date()
    };

    PostSchema.create(postObj).then(async (postSuccess) => {
        await UserSchema.update({
            _id: req.user._id
        }, {
            $push: {Posts : {
                PostId: postSuccess._id,
                Post: postSuccess.Post,
                CreatedAt: new Date()
            }}
        })
        res.status(HttpStatus.OK).json({message:'Post Created Successfully', post: postSuccess});
    })
    .catch(error => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Server Error on Post Creation', postError: error});
    });
};


module.exports.GetAllPost = async (req, res) => {
    try {
        const posts = await PostSchema.find({})
        .populate('Users')
        .sort({CreatedAt: -1}); 

        res.status(HttpStatus.OK).json({message:'User Posts Found Successfully', userPosts: posts});
    }
    catch(err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'User Posts Found Error', err: err});
    }
};


module.exports.LikePost = async (req, res) => {
    const postId = req.body._id;

    await PostSchema.update({
        _id: postId,
        'Likes.UserName': {$ne: req.user.UserName}
    }, {
        $push: {
            Likes: {UserName: req.user.UserName}
        },
        $inc: {TotalLikes: 1}
    }).then((likeStatus) => {
        res.status(HttpStatus.OK).json({status: true, message:'User Like Post Successfully'});
    }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'User Like Post Error'});
    });
};