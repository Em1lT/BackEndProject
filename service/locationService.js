const urli = "https://api.digitransit.fi/geocoding/v1/search?text=";
const httpService = require('./httpService');


function getLocation(address) {

    let url = urli + address;
    console.log(url)
    return httpService.getData(url)
        .then((response) => {
            return [response.data.bbox[0], response.data.bbox[1]]
        })
}

module.exports = {
    getLocation: getLocation
}