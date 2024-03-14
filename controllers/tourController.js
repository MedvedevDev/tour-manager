const fs = require("fs");
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')

// Middleware
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage'
    next()
}

// Route handlers
exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.send(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id: req.params.id}); -- analog

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.send(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                updatedTour: tour
            }
        })
    } catch (err) {
        res.send(400).json({
            status: 'failed',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id, )
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.send(400).json({
            status: 'failed',
            message: err
        })
    }
}

// Pipeline for calculating statistics
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: 'difficulty' },
                    numTours: { $sum: 1 },
                    numRating: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 } // 1 - ascending
            }
            // {
            //     $match: { _id: { $ne: 'EASY' } } // ne == not equal
            // }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
    } catch (err) {
        res.send(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' // deconstruct an array field from input document and then output one document for each element of an array
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`), // date greater then..
                        $lte: new Date(`${year}-12-31`) // date less then..
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numToursStarts: { $sum: 1 }, // count amount of tours in certain month
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0 // make _id field not visible
                }
            },
            {
                $sort: { numToursStarts: -1 }
            },
            {
                $limit: 12
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })

    } catch (err) {
        res.send(404).json({
            status: 'failed',
            message: err
        })
    }
}
