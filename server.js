const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'}) // read variables from the files and save them into nodejs env variables
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(connection => {
    //console.log(connection.connections);
    console.log('Connection successful')
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up.')
})