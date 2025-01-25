const prisma = require('./client');



exports.createUser = async(username, password) => {
    return await prisma.user.create({
        data: {
            username,
            password
        }
    })
}

exports.getUser = async(username) => {
    return await prisma.user.findUnique({
        where: {
            username,
        },
    })
}

exports.getPublishedPosts = async() => {
    return await prisma.post.findMany({
        where: {
            published: true
        },
        include: {
            author: {
                select: {
                    username: true
                }
            },
        }
    })
}

exports.getAllPosts = async() => {
    return await prisma.post.findMany({
        include: {
            author: {
                select: {
                    username: true
                }
            },
        }
    })
}

exports.getPost = async(id) => {
    return await prisma.post.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            author: {
                select: {
                    username: true
                }
            },
            comments: {
                orderBy: {
                    creationDate: 'desc'
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            }
        }
    })
}

exports.createPost = async(authorId, title, published = false, cover_url = null, content = "" ) => {
    return await prisma.post.create({
        data: {
            title,
            published,
            cover_url,
            content,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    })
}

exports.deletePost = async(id) => {
    return await prisma.post.delete({
        where: {
            id
        }
    })
}

exports.updatePost = async(postId, title, published = false, cover_url = '/images/no-image.jpg', content = "" ) => {
    return await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            title,
            published,
            cover_url,
            content,
        }
    })
}

exports.getComments = async(postId) => {
    return await prisma.comment.findMany({
        where: {
            postId
        },
        include: {
            author: {
                select: {
                    username: true
                }
            }
        }
    })
}

exports.createComment = async(authorId, postId, content) => {
    return await prisma.comment.create({
        data: {
            authorId,
            postId,
            content
        },
        include: {
            author: {
                select: {
                    username: true
                }
            }
        }
    })
}

exports.deleteComment = async(postId, commentId) => {
    return await prisma.comment.delete({
        where: {
            id: commentId,
            postId
        }
    })
}