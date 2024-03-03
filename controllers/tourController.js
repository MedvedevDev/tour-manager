const fs = require("fs");
const Tour = require('./../models/tourModel');

// Route handlers
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

exports.getAllTours = async (req, res) => {
    try {
        // const tours = await Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy')

        // BUILD QUERY
        // 1.A) Filtering
        const queryObj = {
            ...req.query
        };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]); // deleting excludedFields from queryObj array

        // 1.B) Advanced Filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // {difficulty: 'easy', duration: { $gte: 5 }}
        // {difficulty: 'easy', duration: { gte: '5' }}
        let query = Tour.find(JSON.parse(queryString)); // Tour.find returns a query and we store it into the variable

        // 2) SORTING
        if (req.query.sort) {
            // mongoose method - sort('price ratingsAverage')
            let sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 3) LIMIT OUTPUT FIELDS
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // exclude '__v' field
        }

        // EXECUTE QUERY
        const tours = await query;

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