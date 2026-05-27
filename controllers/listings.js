
const axios = require("axios");
const Listing = require('../models/listing');

module.exports.index = async (req, res) => {

    let filter = {};

    if (req.query.search) {

        filter = {
            $or: [
                {
                    title: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                },
                {
                    country: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                }
            ]
        };

    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", { allListings });

};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    const locationText = `${newListing.location}, ${newListing.country}`;

    // OpenStreetMap Geocoding
    const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`,
        {
            headers: {
                "User-Agent": "StayHubApp/1.0"
            }
        }
    );

    if (response.data.length > 0) {
        newListing.geometry = {
            lat: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon),
        };
    }

    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    console.log(newListing);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};