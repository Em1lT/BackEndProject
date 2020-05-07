'use strict';
/**
 * Service to get data from hsl
 * https://api.digitransit.fi
 */
const urli = "https://api.digitransit.fi/geocoding/v1/search?text=";
const httpService = require('./httpService');



const getLocation = async (address) => {

    let url = urli + address;
    let data = await httpService.getData(url)
    return {coordinates: data.data.features[0].geometry.coordinates, locality: data.data.features[0].properties.locality}
}

module.exports = {
    getLocation: getLocation
}