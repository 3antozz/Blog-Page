const { Router } = require('express');
const fn = require('./fn');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');
const passport = require('passport');
const {body, validationResult} = require('express-validator');

const validateMessage= [
    body("content").trim().notEmpty().withMessage("Comment must not be empty").bail().isLength({min: 3, max: 70}).withMessage("Comment must be between 3 and 70 characters"),
];
const router = Router();



router.get('/', asyncHandler(async(req, res) => {
    const posts = await db.getPublishedPosts();
    const formattedPosts = posts.map((post) => {
        return {...post, creationDate: fn.formatDate(post.creationDate)}
    });
    return res.json({posts: formattedPosts});
}))

router.get('/:postId', asyncHandler(async(req, res) => {
    const postId = req.params.postId;
    const post = await db.getPost(+postId);
    post.creationDate = fn.formatDate(post.creationDate)
    return res.json({post});

}))

// PROTECTED ROUTES
//---------------------------------------------------------------------------------

router.use((req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next);
})

router.get('/all', fn.checkAdmin, asyncHandler(async(req, res) => {
    const posts = await db.getAllPosts();
    return res.json({posts});
}))

router.post('/', fn.checkAdmin, asyncHandler(async(req, res) => {
    const { title, cover_url, content } = req.body;
    const published = req.body.published === 'true';
    const post = await db.createPost(+req.user.id, title, published, cover_url, content);
    return res.json({post});
}))

router.delete('/:postId', fn.checkAdmin, asyncHandler(async(req, res) => {
    const postId = req.params.postId;
    const post = await db.deletePost(+postId);
    return res.json({post});
}))

router.put('/:postId', fn.checkAdmin, asyncHandler(async(req, res) => {
    const { title, cover_url, content } = req.body;
    const published = req.body.published === 'true';
    const postId = req.params.postId;
    const post = await db.updatePost(+postId, title, published, cover_url, content);;
    return res.json({post});
}))

router.get('/:postId/comments', asyncHandler(async(req, res) => {
    const postId = req.params.postId;
    const post = await db.getComments(+postId);
    return res.json({post});
}))

router.post('/:postId/comments', fn.checkAuth, validateMessage , asyncHandler(async(req, res, next) => {
    const result = validationResult(req);
    if(!result.isEmpty()) {
        const errors = result.errors.map(err => err.msg);
        errors.code = 400;
        return next(errors)
    }
    const { content } = req.body;
    const postId = req.params.postId;
    const post = await db.createComment(+req.user.id, +postId, content);
    return res.json({post});
}))

router.delete('/:postId/comments/:commentId', fn.checkAdmin, asyncHandler(async(req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId
    const post = await db.deleteComment(+postId, +commentId);
    return res.json({post});
}))









module.exports = router;