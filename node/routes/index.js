const { Router } = require('express');
const auth = require('./auth');
const posts = require('./posts');



const router = Router();

router.use('/', auth);
router.use('/posts', posts)






module.exports = router;