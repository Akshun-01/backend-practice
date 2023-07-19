const express = require('express');
const router = express.Router();
const {check} = require('express-validator');

const userControllers = require('../controllers/user');

router.get('/', userControllers.getUsers);
router.post('/signup', 
    [
        check('name').not().isEmpty(),
        check('password').isLength({min : 5}),
        check('email').normalizeEmail().isEmail(),
    ],
    userControllers.signUp
);
router.post('/login', 
    [
        check('password').isLength({min : 5}),
        check('email').isEmail(),
    ],
    userControllers.login
);

module.exports = router;