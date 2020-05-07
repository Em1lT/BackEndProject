'use strict';
let url = process.env.WEATHER_URL;
let apiKey = process.env.WEATHER_API;
const httpService = require('./httpService');


function buildUrl() {
    let fullUrl = url + "&key="+ apiKey;
    return fullUrl;
}

async function getAll() {

    let url = await buildUrl();
    let response = await httpService.getData(url)
    return response
}

module.exports = {
    getAll: getAll
}