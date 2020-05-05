'use strict';
/**
 * 
 * Model for user. Used in Register
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, required: true },
    password: {type: String, required: true },
    address: {
        street_address: {type: String, required: true },
        locality: {type: String},
        coordinates: {
            lat: {type: Number},
            lon: {type: Number}
        }
    },
    intrests: [],
    friends: [],
    reservations: [],
})

module.exports = mongoose.model('user', userModel);
