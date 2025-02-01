const db = require('../db/queries');
const {validationResult} = require('express-validator');


exports.deleteComment = async(req, res, next) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    let comment;
    try {
        comment = await db.getComment(+postId, +commentId);
    } catch(err) {
        return next(err)
    }
    if(req.user.id !== comment.author.id && !req.user.isAdmin) {
        const error = new Error('Unauthorized Access');
        error.code = 401;
        return next(error)
    }
    const post = await db.deleteComment(+postId, +commentId);
    return res.json({post});
}

exports.getPostComments = async(req, res) => {
    const postId = req.params.postId;
    const post = await db.getComments(+postId);
    return res.json({post});
}

exports.createComment = async(req, res, next) => {
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
}