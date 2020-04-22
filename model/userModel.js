const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, required: true },
    password: {type: String, required: true },
    address: {type: String, required: true },
    intrests: [],
    friends: [],
    reservations: [],
})

module.exports = mongoose.model('user', userModel);