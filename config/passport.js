const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { validPassword } = require("../lib/passwordUtils");
const User = require("./database");

//Passport, by default, needs the username and password to be exactly as it is in the database.
//We can add customFields so that we can manipulate the username and password and make it so that the username can have capital letters and still work

const customFields = {
    usernameField: "username",
    passwordField: "password"
};

const verifyCallback = async (username, password, done) => {
    //Verifies whether the username and password fits a user
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false);
        }
        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err);
    }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findOne({ _id: userId });
        return done(null, user);
    } catch {
        return done(err);
    }
});
