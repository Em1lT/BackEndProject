const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const weather = new Schema({

    // Moonrise time unix timestamp (UTC)                
    moonrise_ts: Number,

    // Abbreviated wind direction
    wind_cdir: String,

    // Average relative humidity(%)
    rh: Number,

    // Average Pressure
    pres: Number,

    // High Temperature - Calculated from 6AM to 6AM local time (default Celcius)
    high_temp: Number,

    // Sunset time unix timestamp (UTC)
    sunset_ts: Number,

    // Average Ozone (Dobson units)
    ozone: Number,

    // Moon phase illumination fraction (0-1)
    moon_phase: Number,

    // Wind gust speed (Default m/s)
    wind_gust_spd: Number,

    // Snow Depth (default mm)
    snow_depth: Number,

    // Average total cloud coverage (%)
    clouds: Number,

    // Forecast period start unix timestamp (UTC)
    ts: Number,

    // Sunrise time unix timestamp (UTC)
    sunrise_ts: Number,

    // Apparent/"Feels Like" temperature at min_temp time (default Celcius)
    app_min_temp: Number,

    // Wind speed (Default m/s)
    wind_spd: Number,

    // Probability of Precipitation (%)
    pop: Number,

    // Verbal wind direction
    wind_cdir_full: String,

    // Average sea level pressure (mb)
    slp: Number,

    // Moon lunation fraction (0 = New moon, 0.50 = Full Moon, 0.75 = Last quarter moon)
    moon_phase_lunation: Number,

    //Date the forecast is valid for in format YYYY-MM-DD [Midnight to midnight local time]
    valid_date: Date,

    /**
     * Apparent/"Feels Like" temperature at max_temp time (default Celcius)
     * @param: app_max_temp 
     **/
    app_max_temp: Number,

    /**
     * Visibility (default KM)
     * @param: vis
     */
    vis: Number,


    /**
     * Average dew point (default Celcius) 
     * @param dewpt
     */
    dewpt: Number,


    /**
     * Accumulated snowfall (default mm)
     * @param snow
     */
    snow: Number,


    /**
     * Maximum UV Index (0-11+)
     * @param uv
     */
    uv: Number,


    /**
     * Weahter object
     * @param weather
     */
    weather: {

        /**
         * Weather icon code
         * @param icon
         */
        icon: String,


        /**
         * Weather code
         * @param code
         */
        code: String,


        /**
         * Text weather description
         * @param description
         */
        description: String
    },

    
    /**
     * Wind direction (degrees)
     * @param wind_dir
     */
    wind_dir: Number,
    
    
    /**
     * [DEPRECATED] Maximum direct component of solar radiation (W/m^2)
     * @param max_dhi
     */
    max_dhi: String,

    /**
     * High-level (>5km AGL) cloud coverage (%)
     * @param clouds_hi
     */
    clouds_hi: Number,
    
    /**
     * Accumulated liquid equivalent precipitation (default mm)  
     * @param precip
     */
    precip: Number,

    /**
     * Low Temperature - Calculated from 6AM to 6AM local (default Celcius)
     * @param low_temp
     */
    low_temp: Number,
    
    /**
     * Maximum Temperature (default Celcius)
     * @param max_temp
     */
    max_temp: Number,
    
    /**
     * Moonset time unix timestamp (UTC)
     * @param moonset_ts
     */
    moonset_ts: Number,
    
    /**
     * [DEPRECATED] Forecast valid date (YYYY-MM-DD)
     * @param datetime
     */
    datetime: String,
    
    /**
     * Average Temperature (default Celcius)
     * @param temp
     */
    temp: Number,
    
    /**
     * Minimum Temperature (default Celcius)
     * @param min_temp
     */
    min_temp: Number,
    
    /**
     * Mid-level (~3-5km AGL) cloud coverage (%)
     * @param clouds_mid
     */
    clouds_mid: Number,
    
    /**
     * Low-level (~0-3km AGL) cloud coverage (%)
     * @param clouds_low
     */
    clouds_low: Number,

    
    /**
     * City name
     * @param city
     */
    city: String
})

module.exports = mongoose.model('daysWeather', weather)