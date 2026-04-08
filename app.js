const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejs = require('ejs-mate');
const wrapAsync = require("./Utils/wrapAsync.js");
const ExpressError = require("./Utils/EcpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wonderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejs);

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings", wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for Listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for updating List");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});








// const express = require('express');
// const app = express();
// let port = 8080;
// const mongoose = require('mongoose');
// const listing = require('./models/listing.js');
// const mongoose_URL = "mongodb://127.0.0.1:27017/Wonderlust";
// const path = require('path');


// // app.set("view engine", "ejs");
// // app.set("views", path.join(__dirname, "views"));

// main()
//     .then(() => {
//         console.log("connected to DB");
//     }).catch((err) => console.log(err));

// async function main() {
//     await mongoose.connect(mongoose_URL);
// }

// //root route
// app.get("/", (req, res) => {
//     res.send("welcome to root ");
// });

// // app.get("/listings", async (req, res) => {
// //     // const allListings = await listing.find({});
// //     // res.render("listings/index.ejs", { allListings });
// //     // console.log(allListings);
// //     Listing.find({}).then((res) => {
// //         console.log(res);
// //     });
// // });

// // //listin root
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "kitt's home",
//         description: "a beautiful villa by the beach",
//         price: 12000,
//         location: "johu beach, mumbai",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("data  was saved");
//     res.send("successful test");
// });

// //server
// app.listen(port, () => {
//     console.log(`server is listening on port : ${port} `)
// });





