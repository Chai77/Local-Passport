const url = require("url");

module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).redirect(
            url.format({
                pathname: "/login",
                query: {
                    error: "Please login first"
                }
            })
        );
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated) {
        if (req.user.admin) {
            next();
        } else {
            res.status(401).redirect(
                url.format({
                    pathname: "/protected-route",
                    query: {
                        error: "You are not an admin"
                    }
                })
            );
        }
    } else {
        res.status(401).redirect(
            url.format({
                pathname: "/login",
                query: {
                    error: "Please login first"
                }
            })
        );
    }
};
