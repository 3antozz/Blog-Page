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
        }
    })
}