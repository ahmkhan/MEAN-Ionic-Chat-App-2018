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

        const topPosts = await PostSchema.find({TotalLikes: {$gte: 2}})
            .populate('Users')
            .sort({CreatedAt: -1});

        res.status(HttpStatus.OK).json({message:'User Posts Found Successfully', userPosts: posts, userTopPosts: topPosts});
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


module.exports.AddComment = async (req, res) => {
    const postId = req.body.PostId;
    const comment = req.body.Comment;

    await PostSchema.update({
        _id: postId
    }, {
        $push: {
            Comments: {
                UserId: req.user._id,
                FullName: req.user.FullName,
                UserName: req.user.UserName,
                Comment: comment,
                CreatedAt: new Date()
            }
        }
    }).then((commentStatus) => {
        res.status(HttpStatus.OK).json({status: true, message:'User Comment Successfully'});
    }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'User Comment Error'});
    });
};


module.exports.GetSinglePost = async (req, res) => {
    await PostSchema.findOne({
        _id: req.params.id
    })
        .populate('user')
        .populate('Comments.UserId')
        .then((foundPost) => {
            res.status(HttpStatus.OK).json({status: true, message:'Post Found Successfully', post: foundPost});
        }).catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Post Not Found'});
        });
};