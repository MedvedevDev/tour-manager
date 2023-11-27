const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'}) // read variables from the files and save them into nodejs env variables
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(connection => {
    //console.log(connection.connections);
    console.log('Connection successful')
})

//Create schema
const tourSchema = new mongoose.Schema({
    // name: String,
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

//Create model
const Tour = new mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'String',
    rating: 4,
    price: 10
})
testTour.save().then(doctument => {
    console.log(doctument)
}).catch(error =>{
    console.log(error)
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up.')
})