'use strict';
/**
 *
 * Model for reservations.
 *
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationModel = new Schema({
  /**
   * id of the event
   * @param {String} id
   */
  id: String,
  user: String,
  /**
   * When the the event was reserved
   * @param {Date} created_timestamp
   */
  created_timestamp: { type: Date, default: Date.now },

  /**
   * on What day the event was reserved
   * @param {Date} reservation_timestamp
   */
  reservation_timestamp: Date,

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
    sv: String,
    zv: String,
  },

  source_type: {
    id: Number,
    name: String,
  },
  info_url: String,
  modified_at: String,

  location: {
    lat: Number,
    lon: Number,
    address: {
      street_address: String,
      postal_code: String,
      locality: String,
    },
  },
  description: {
    intro: String,
    body: String,
    images: [
      {
        url: String,
        copyright_holder: String,
        license_type: {
          id: Number,
          name: String,
        },
      },
    ],
  },
  tags: [
    {
      id: String,
      name: String,
    },
  ],
  event_dates: {
    starting_day: Date,
    ending_day: Date,
    additional_description: String,
  },
});

module.exports = mongoose.model("reservation", reservationModel);
