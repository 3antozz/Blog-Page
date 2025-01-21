const express = require('express');
const router = require('./routes');
const path = require('node:path');
const passport = require('passport')


const app = express();
app.use(passport.authenticate('jwt', { session: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', router);

app.use((req, res, next) => {
    const error = new Error('404 Not Found')
    error.code = 404;
    next(error)
})



app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.code || 500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || 500
    });
})
app.listen(3000, () => console.log('Server listening on port 3000!'))
