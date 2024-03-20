const fs = require("fs");
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

// Middleware
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage'
    next()
}


// Route handlers
exports.getAllTours = catchAsync(async (req, res, next) => {
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
})

exports.getTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id: req.params.id}); -- analog

        if(!tour) {
            next(new AppError('No tour found with this ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
})

exports.createTour = catchAsync(async (req, res, next) => {
    // try {
    //     const newTour = await Tour.create(req.body);
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTourч
    //         }
    //     });
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'failed',
    //         message: err
    //     })
    // }
    const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
})

exports.updateTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return next(new AppError('No tour found with this ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
})

// Pipeline for calculating statistics
exports.getTourStats = catchAsync(async (req, res, next) => {
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
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
})
