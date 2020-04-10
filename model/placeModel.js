const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const place = new Schema({

    /**
     * Nearest city name
     * @param 
     */
    city_name: String,

    /**
     * Longitude (Degrees)
     * @param lon
     */
	lon: Number,
    
    /**
     * Local IANA Timezone
     * @param timezone
     */
    timezone: String,
    
    /**
     * Latitude (Degrees)
     * @param lat 
     */
    lat: Number,
    
    /**
     * Country abbreviation
     * @param country_code
     */
    country_code: String,
    
    /**
     * State abbreviation/code
     * @param state_code
     */
    state_code: Number,

    /**
     * ids for each day
     * @param weatherIds
     */
    weatherIds: [{
        type: [Schema.Types.ObjectId],
        ref: 'daysWeather'
    }]

})

module.exports = mongoose.model('place', place)
