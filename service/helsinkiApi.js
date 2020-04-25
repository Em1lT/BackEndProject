let url = process.env.HEL_URL;
let limitFilter = "limit=";
let event = process.env.HEL_PARAM;
const httpService = require('./httpService');


function buildUrl() {
    let fullUrl = url + event + "?" + limitFilter + "1000";
    return fullUrl;
}

function getAll() {

    let url = buildUrl();
    console.log(url)
    return httpService.getData(url)
        .then((response) => {
            return response.data.data
        })
}

module.exports = {
    getAll: getAll
}