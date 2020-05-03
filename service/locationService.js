const urli = "https://api.digitransit.fi/geocoding/v1/search?text=";
const httpService = require('./httpService');


function getLocation(address) {

    let url = urli + address;
    console.log(url)
    return httpService.getData(url)
        .then((response) => {
            return {coordinates: response.data.features[0].geometry.coordinates, locality: response.data.features[0].properties.locality}
        })
}

module.exports = {
    getLocation: getLocation
}