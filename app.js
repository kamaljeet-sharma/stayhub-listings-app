if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejs = require('ejs-mate');
const ExpressError = require("./Utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/Wonderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
    });

async function main() {
    await mongoose.connect(dbUrl, {
        tlsAllowInvalidCertificates: true,
        serverSelectionTimeoutMS: 5000,
    });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejs);

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET_KEY || "mysupersecretkeykittu@143",
//     },
//     touchAfter: 24 * 3600, // time period in seconds
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in mongo Session store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET_KEY || "mysupersecretkeykittu@143",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     return res.status(statusCode).render("error.ejs", { err });
//     // res.status(statusCode).send(message);
// });

app.use((err, req, res, next) => {
    console.error(err);

    let { statusCode = 500 } = err;

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).send(err.message || "Something went wrong");
});

// app.listen(8080, () => {
//     console.log("server is listening to port 8080");
// });

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});