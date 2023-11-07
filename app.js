const express = require('express')
const fs = require('fs')
const morgan = require('morgan')

const app = express()


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.use(express.json()); // Data from the body is added to the request object
app.use((req, res, next) => {
    console.log('MIDDLEWARE');
    next()
})
app.use(morgan('dev'));

// ---------------------------------- route handlers
const createTour = (req, res) => {
    const newId = tours[tours.length-1].id + 1;
    console.log(req.body)
    const newTour = {
        "id": newId,
        ...req.body
    }

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 201,
            data: {
                newTour
            }
        });
    });
}

const getTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const updateTour = (req, res) => {
    if (req.params.id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            updatedTour: 'updated tour'
        }
    })
}

const deleteTour = (req, res) => {
    if (req.params.id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error'
    })
}

// ---------------------------------- routes
const tourRouter = express.Router();
const userRouter = express.Router();

// Mounting routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/')
    .post(createTour)
    .get(getTours)

tourRouter.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

userRouter.route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

const port = 3000;
app.listen(port, () => {

})