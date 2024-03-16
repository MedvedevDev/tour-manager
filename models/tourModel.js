const mongoose = require('mongoose')
const slugify = require('slugify')

// Create schema
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
    startDates: [Date], // array of dates
    secretTour: {
        type: Boolean,
        default: false
    },
    slug: String
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// VIRTUAL PROPERTY - Tour duration in weeks
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
}) // get() - getter

// DOCUMENT MIDDLEWARE: runs before document is .save(), .create(), .remove()...
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower:true});
    next(); // to call next middleware
})

tourSchema.pre('save', function (next) {
    console.log('Saving document...');
    next();
})

// tourSchema.post('save', function (doc, next) {
//     console.log(doc)
//     next(); // to call next middleware
// })

// QUERY MIDDLEWARE: runs on .find()
tourSchema.pre(/^find/, function (next) { // exclude from getAll query all the documents (tours) where prop 'secretTour' !== 'true'
    // /^find/ ---- all the strings that start with 'find'
    // tourSchema.pre('find', function (next) {
    this.find({ secretTour: {$ne: true} })
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(docs);
    next();
})

// Create model
const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;