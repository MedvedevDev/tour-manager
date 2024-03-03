const mongoose = require('mongoose')
const {flatten} = require("express/lib/utils");

//Create schema
const tourSchema = new mongoose.Schema({
    // name: String,
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a group difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String], // array of images
    createdAt: {
        type: Date,
        default: Date.now(),
        // if you need to always hide some field (can be made for any other field), for example 'createdAt' field - select: false
        select: false
    },
    startDates: [Date] // array of dates
});

//Create model
const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;