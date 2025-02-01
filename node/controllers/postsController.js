const db = require('../db/queries');
const fn = require('../routes/fn');

exports.getPublishedPosts = async(req, res) => {
    const posts = await db.getPublishedPosts();
    const formattedPosts = posts.map((post) => {
        return {...post, creationDate: fn.formatDate(post.creationDate)}
    });
    return res.json({posts: formattedPosts});
}

exports.getAllPosts = async(req, res) => {
    const posts = await db.getAllPosts();
    const formattedPosts = posts.map((post) => {
        return {...post, creationDate: fn.formatDate(post.creationDate)}
    });
    return res.json({posts: formattedPosts});
}

exports.getPost = async(req, res) => {
    const postId = req.params.postId;
    const post = await db.getPost(+postId);
    post.creationDate = fn.formatDate(post.creationDate)
    return res.json({post});

}

exports.togglePublishStatus = async(req, res, next) => {
    const postId = req.params.postId;
    try {
        await db.getPost(+postId);
    } catch(err) {
        return next(err)
    }
    const post = await db.publishPost(+postId);
    return res.json({post});
}

exports.createPost = async(req, res) => {
    const { title, cover_url, content } = req.body;
    const published = req.body.published === true;
    const post = await db.createPost(+req.user.id, title, published, cover_url, content);
    return res.json({post});
}

exports.deletePost = async(req, res) => {
    const postId = req.params.postId;
    const post = await db.deletePost(+postId);
    return res.json({post});
}

exports.updatePost = async(req, res) => {
    const { title, cover_url, content } = req.body;
    const published = req.body.published === true;
    const postId = req.params.postId;
    const post = await db.updatePost(+postId, title, published, cover_url, content);;
    return res.json({post});
}