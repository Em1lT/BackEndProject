'use strict';

/**
 * Service to call helsinkiApi Which is a free api to use
 * http://open-api.myhelsinki.fi/
 */

let url = process.env.HEL_URL;
let limitFilter = "limit=";
let event = process.env.HEL_PARAM;
const httpService = require('./httpService');

const buildUrl = () => {
    let fullUrl = url + event + "?" + limitFilter + "1000";
    return fullUrl;
}

const getAll = async () =>  {

    let url = buildUrl();
    let data = await httpService.getData(url);
    return data.data.data;
}

module.exports = {
    getAll: getAll
}