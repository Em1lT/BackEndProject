const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    event: {type: String},

})

module.exports = mongoose.model('user', userModel);