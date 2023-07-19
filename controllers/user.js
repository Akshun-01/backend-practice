const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
      id: 'u1',
      name: 'Max Schwarz',
      email: 'test@test.com',
      password: 'testers'
    }
];

const getUsers = async(req, res, next) => {
    let users;
    try{
        users = await User.find({},'-password');
    }catch(err){
        return next(new HttpError(err,404));
    }

    res.json(users.map(user => user.toObject({getters:true})));
}

const signUp = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next( new HttpError("Invalid inputs", 422));
    }

    const {name, email, password} = req.body;
    let user;
    try{
        await user.findOne({email: email})
    }catch(err){
        return next(new HttpError(err, 404));
    }

    if(user){
        return next(new HttpError('User already registered, please login instead.', 404));
    }

    let newUser = new User({name, email, password});
    try{
        await newUser.save();
    }catch(err){
        return next(new HttpError(err,422));
    }

    res.status(201).json({user: newUser});
}

const login = async(req, res, next) => {
    const {email, password} = req.body;
    let user;
    try{
        await user.findOne({email: email})
    }catch(err){
        return next(new HttpError(err, 404));
    }

    if(!user){
        return next(new HttpError("User with given email does not exists.", 404));
    }
    if(user.password !== password){
        return next(new HttpError("Incorrect password.", 404));
    }

    res.json({message : "Logged in successfully"})
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;