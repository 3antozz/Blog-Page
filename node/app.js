const express = require('express');
const router = require('./routes');
const path = require('node:path');
const passport = require('passport')
var cors = require('cors')


const app = express();
app.use(cors())
app.options('*', cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((req, res, next) => {
    const openRoute = ['/login', '/sign-up'];
    if (openRoute.includes(req.path)) {
        return next();
    }
    passport.authenticate('jwt', { session: false})(req, res, next);
})
app.use('/', router);
app.use((req, res, next) => {
    const error = new Error('404 Not Found')
    error.code = 404;
    next(error)
})



app.use((error, req, res, next) => {
    console.log(error);
    if (Array.isArray(error)) {
        return res.status(error.code || 500).json({
            errors: error,
            code: error.code || 500
        });
    }
    res.status(error.code || 500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || 500
    });
})
app.listen(3000, () => console.log('Server listening on port 3000!'))
