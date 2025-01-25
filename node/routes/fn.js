const { format } = require("date-fns");
exports.checkAuth = (req, res, next) => {
    if(req.user) {
        return next();
    } else {
        const error = new Error('Unauthorized Access');
        error.code = 401;
        return next(error)
    }
}

exports.checkAdmin = [this.checkAuth, (req, res, next) => {
    if(req.user.isAdmin) {
        return next();
    } else {
        const error = new Error('Unauthorized Access');
        error.code = 401;
        return next(error)
    }
}]

exports.formatDate = (date) => {
    return format(new Date(date), "PP")
}