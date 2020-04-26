const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationModel = new Schema({

    id: String,
    user: String,
    name: {
        fi: String,
        en: String,
        sv: String,
        zv: String,
    },
    description: {
        intro: String,
        body: String,
        images: [{
            url: String,
            copyright_holder: String,
            license_type: {
                id: Number,
                name: String
            }
        }]
    },
    tags: [{
        id: String,
        name: String
    }],
    event_dates: {
        starting_day: Date,
        ending_day: Date,
        additional_description: String
    }
})

module.exports = mongoose.model('reservation', reservationModel);