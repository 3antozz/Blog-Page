const { Router } = require('express');
const fn = require('./fn');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const postsController = require('../controllers/postsController')
const commentsController = require('../controllers/commentsController')

const router = Router();                   



router.get('/', asyncHandler(postsController.getPublishedPosts))

router.get('/all', passport.authenticate('jwt', { session: false }), fn.checkAdmin, asyncHandler(postsController.getAllPosts))

router.get('/:postId', asyncHandler(postsController.getPost))

// PROTECTED ROUTES
//---------------------------------------------------------------------------------

router.use((req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next);
})

router.put('/:postId/publish', fn.checkAdmin, asyncHandler(postsController.togglePublishStatus))

router.delete('/:postId/comments/:commentId', fn.checkAuth, asyncHandler(commentsController.deleteComment))


router.post('/', fn.checkAdmin, asyncHandler(postsController.createPost))

router.delete('/:postId', fn.checkAdmin, asyncHandler(postsController.deletePost))

router.put('/:postId', fn.checkAdmin, asyncHandler(postsController.updatePost))

router.get('/:postId/comments', asyncHandler(commentsController.getPostComments))


router.post('/:postId/comments', fn.checkAuth , asyncHandler(commentsController.createComment))



module.exports = router;