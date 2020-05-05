const mongoose = require('mongoose')
const {logger} = require('../winston');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err => logger.info("Connected to database")));