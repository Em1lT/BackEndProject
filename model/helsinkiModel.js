'use strict';
/**
 * 
 * Model for helsinki api. This is modeled after what helsinkiApi gives us
 * 
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helsinkiEvents = new Schema({

    /**
     * id of the event
     * @param {String} id 
     */
    id: String,

    /**
     * name of the event
     * @param {String} name 
     */
    name: {

        /**
         * Name of the event in finnish
         * @param {String} fi 
         */
        fi: String,

        /**
         * Name of the event in english
         * @param {String} en 
         */
        en: String,

        /**
         * Name of the event in swedish
         * @param {String} sv 
         */        
        sv: String,
        
        /**
         * Name of the event in finnish
         * @param {String} fi 
         */
        zv: String,
    },

    source_type: {
        id: Number,
        name: String
    },
    info_url: String,
    modified_at: String,

    location: {
        lat: Number,
        lon: Number,
        address: {
            street_address: String,
            postal_code: String,
            locality: String
        }
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
    },
    reservedById: []

},{timestamps: true})

module.exports = mongoose.model('events', helsinkiEvents);