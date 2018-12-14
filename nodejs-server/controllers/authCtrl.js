const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PasswordEncrypt       = require('bcryptjs');
const JWT                   = require('jsonwebtoken');

const UserSchema            = require('../schemas/userSchema');
const HelperFunctions       = require('../helpers/helperFunctions');
const Config                = require('../config/secret');


module.exports.registerNewUser = async (req, res) => {
    let userObj = req.body;
    const userSchemaToValidate = Joi.object().keys({
        FullName: Joi.string().required(),
        UserName: Joi.string().min(5).required(),
        Email: Joi.string().email().required(),
        Password: Joi.string().min(6).required()
    });

    const {error, value} = Joi.validate(userObj, userSchemaToValidate);

    if (error && error.details) {
        return res.status(HttpStatus.BAD_REQUEST).json({message:'Error In User Schema Validation', errorMsg: error.details})
    }

    const userNameExists = await UserSchema.findOne({UserName: HelperFunctions.FirstLetterUpperCase(value.UserName)});

    if (userNameExists) {
        return res.status(HttpStatus.CONFLICT).json({message:'This User Name Already Exists in DB', error: userNameExists});
    }

    const userEmailExists = await UserSchema.findOne({Email: HelperFunctions.allLowerCase(value.Email)});

    if (userEmailExists) {
        return res.status(HttpStatus.CONFLICT).json({message:'This Email Address Already Exists in DB', error: userEmailExists});
    }

    return PasswordEncrypt.hash(value.Password, 10, (err, hash) => {
        if (err) {
            res.status(HttpStatus.BAD_REQUEST).json({message:'Password Encryption Error', error: err});
            return;
        }
        let UserDataToSave = {
            FullName: HelperFunctions.FirstLetterUpperCase(value.FullName),
            UserName: HelperFunctions.FirstLetterUpperCase(value.UserName),
            Email: HelperFunctions.allLowerCase(value.Email),
            Password: hash
        };

        UserSchema.create(UserDataToSave).then((UserSave) => {
            let token = JWT.sign({userData: UserDataToSave}, Config.secretKey, {expiresIn: "1h"});
            if (token) {
                res.cookie('auth', token);
                res.status(HttpStatus.CREATED).json({message:'User Successfully Saved in DB', userData: UserSave, token: token});
            }
        }).catch((UserSaveError) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error in User Saving in DB', userData: UserSaveError});
        }) 
    });
};


module.exports.loginUser = async (req, res) => {
    let loginUserDataObj = req.body;

    if (!loginUserDataObj.UserName || !loginUserDataObj.Password) {
        return res.status(HttpStatus.NOT_FOUND).json({message:'Login Form Details are Incomplete'});
    }

    UserSchema.findOne({UserName: HelperFunctions.FirstLetterUpperCase(loginUserDataObj.UserName)}).then(loginUserFound => {
        if (!loginUserFound) {
            return res.status(HttpStatus.NOT_FOUND).json({message:'Username not exists in DB'});
        }
        return PasswordEncrypt.compare(loginUserDataObj.Password, loginUserFound.Password).then(passwordCompare => {
            if (!passwordCompare) {
                return res.status(HttpStatus.CONFLICT).json({message:'Password Not Match'});
            }

            let token = JWT.sign({data: loginUserFound}, Config.secretKey, {expiresIn: "1h"});
            res.cookie('auth', token);
            return res.status(HttpStatus.OK).json({message:'User Sign In Successful', userData: loginUserFound, token: token});
        });
    })
    .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error Occured during User Login'});
    });
};