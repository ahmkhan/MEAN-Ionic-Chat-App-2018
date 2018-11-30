const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PasswordEncrypt       = require('bcryptjs');
const UserSchema            = require('../schemas/userSchema');
const HelperFunctions       = require('../helpers/helperFunctions');


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
        return res.status(HttpStatus.BAD_REQUEST).json({message:'Error In User Schema Obj', error: error})
    }

    const userEmailExists = await UserSchema.findOne({Email: HelperFunctions.allLowerCase(value.Email)});

    if (userEmailExists) {
        return res.status(HttpStatus.CONFLICT).json({message:'This Email Address Already Exists in DB', error: userEmailExists});
    }

    const userNameExists = await UserSchema.findOne({UserName: HelperFunctions.FirstLetterUpperCase(value.UserName)});

    if (userNameExists) {
        return res.status(HttpStatus.CONFLICT).json({message:'This User Name Already Exists in DB', error: userNameExists});
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
            res.status(HttpStatus.CREATED).json({message:'User Successfully Saved in DB', userData: UserSave});
        }).catch((UserSaveError) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error in User Saving in DB', userData: UserSaveError});
        }) 
    });
};