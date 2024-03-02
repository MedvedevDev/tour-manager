const express = require('express')
const tourController = require('../controllers/tourController')

const router = express.Router();

//router.param('id', tourController.checkID); // Middleware to check for valid id

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router