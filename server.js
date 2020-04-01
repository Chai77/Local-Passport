const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const ejsLayouts = require("express-ejs-layouts");
const router = require("./routes/index");

dotenv.config();

MongoStore = require("connect-mongo")(session);

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Connected to MongoDB");
});
connection.on("error", (err) => {
    console.log(err);
});

const app = express();

const PORT = process.env.PORT || 5000;
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(ejsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: "sessions"
});

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

//Passport Config
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// });

//Routes
app.use("/", router);
//Server: http://localhost:5000
app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});
