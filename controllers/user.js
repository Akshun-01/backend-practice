const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
      id: 'u1',
      name: 'Max Schwarz',
      email: 'test@test.com',
      password: 'testers'
    }
];

const getUsers = (req, res, next) => {
    res.json({user : DUMMY_USERS});
}

const signUp = (req, res, next) => {
    const {name, email, password} = req.body;
    if(DUMMY_USERS.find(u => u.email === email)){
        return next(new HttpError('User already registered, please login instead.', 404));
    }
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password
    }
    DUMMY_USERS.push(newUser);

    res.status(201).json({user: newUser});
}

const login = (req, res, next) => {
    const {email, password} = req.body;
    const user = DUMMY_USERS.find(u => u.email === email);

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