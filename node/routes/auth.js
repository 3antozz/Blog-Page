const { Router } = require('express');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');
const passport = require('passport')
const db = require('../db/queries');
var jwt = require('jsonwebtoken');
require('dotenv');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;


const router = Router();

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;
opts.jsonWebTokenOptions = { 
    maxAge: '7d'
};
passport.use(new JwtStrategy(opts, async function(payload, done) {
    try {
        const user = await db.getUser(payload.username);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

async function signJWT (req, res, next) {
    const user = await db.getUser(req.body.username);
    if(!user) {
        const error = new Error('Incorrect username');
        error.code = 401;
        return next(error)
    }
    const match = await bcrypt.compare(req.body.password, user.password)
    if(!match) {
        const error = new Error('Incorrect password');
        error.code = 401;
        return next(error)
    }
    jwt.sign({username: req.body.username}, process.env.TOKEN_SECRET, (err, token) => {
        if (err) {
            return next(err);
        }
        res.json({token});
    })
}

const validateSignUp = [
    body("username").trim().notEmpty().withMessage("Username must not be empty").matches(/^[a-zA-Z0-9_]+$/).withMessage("Username must only contain alphabet and numbers and no spaces").isLength({min: 3, max: 20}).withMessage("Username must be between 3 and 20 characters"),
    body("password").trim().notEmpty().withMessage("Password must not be empty").isLength({min: 6}).withMessage("Password must be atleast 6 characters long"),
    body('confirm_password').custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage("Passwords don't match")
];

router.post('/sign-up', validateSignUp, async(req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.errors.map(err => err.msg);
        errors.code = 401;
        return next(errors)
    }
    bcrypt.hash(req.body.password, 10, async(err, hash) => {
        if(err) {
            return next(err)
        }
        try {
            const user = await db.createUser(req.body.username, hash);
            res.json({
                username: user.username,
                isAdmin: user.isAdmin
            });
        } catch (error) {
            return next(error);
        }
    })
})

router.post('/login', signJWT)





module.exports = router;