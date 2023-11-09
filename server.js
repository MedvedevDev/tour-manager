const dotenv = require('dotenv')
dotenv.config({path: './config.env'}) // read variables from the files and save them into nodejs env variables

const app = require('./app')

const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up.')
})