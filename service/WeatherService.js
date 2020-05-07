'use strict';

/**
 * 
 * Service to communicate with weatherBit
 * https://www.weatherbit.io/account/login
 */
let url = process.env.WEATHER_URL;
let apiKey = process.env.WEATHER_API;
const httpService = require('./httpService');


const buildUrl = () => {
    let fullUrl = url + "&key="+ apiKey;
    return fullUrl;
}

const getAll = async () => {

    let url = await buildUrl();
    let response = await httpService.getData(url)
    return response
}

module.exports = {
    getAll: getAll
}