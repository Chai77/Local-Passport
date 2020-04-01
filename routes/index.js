const express = require("express");
const passport = require("passport");
const { genPassword } = require("../lib/passwordUtils");
const { isAuth, isAdmin } = require("./authMiddleware");
const User = require("../config/database");
const url = require("url");

const router = express.Router();

//POST routes

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login-failure",
        successRedirect: "/login-success"
    }),
    (req, res) => {}
);

router.post("/register", async (req, res) => {
    const { salt, hash } = genPassword(req.body.password);

    console.log(req.body.admin);

    const newUser = new User({
        username: req.body.username,
        hash,
        salt,
        admin: req.body.admin === "on"
    });

    try {
        await newUser.save();
        console.log(newUser);
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.redirect(
            url.format({
                pathname: "/login",
                query: {
                    error: "Could not create account"
                }
            })
        );
    }
});

router.get("/", (req, res) => {
    res.send('<h1>Home</h1><p>Please <a href="register">register</a></p>');
});

router.get("/login", (req, res) => {
    res.render("login.ejs", {
        errorMessage: req.query.error ? req.query.error : ""
    });
});

router.get("/register", (req, res) => {
    res.render("register.ejs");
});

router.get("/protected-route", isAuth, (req, res) => {
    res.render("authenticated.ejs", {
        authenticated: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : "",
        errorMessage: req.query.error ? req.query.error : ""
    });
});

router.get("/admin-route", isAdmin, (req, res) => {
    res.render("admin.ejs", {
        authenticated: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : "",
        admin: req.user.admin ? req.user.admin : false
    });
});

router.post("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

router.get("/login-success", (req, res) => {
    console.log(req.user.admin);
    res.render("login_result.ejs", { loggedIn: true, admin: req.user.admin });
});

router.get("/login-failure", (req, res) => {
    res.render("login_result.ejs", { loggedIn: false, admin: false });
});

module.exports = router;
