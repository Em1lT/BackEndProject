'use strict';

/**
 * 
 * Controller to weather db.
 * 
 * functions:
 * getDates
 * getOne
 * update
 * deleteOldAndsaveWeather
 * createModel
 */
const moment = require('moment');
const weatherApi = require('../service/WeatherService');
const weatherModel = require('../model/weatherModel');
const placeModel = require('../model/placeModel');
const {logger} = require('../winston');

function getDates(startDate, stopDate) {
    let dateArray = [];
    let currentDate = moment(startDate);
    let stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

const getOne = async (startDay, endingDay, city) => {

    let rightWeather = [];
    let goal = moment(startDay.getTime()).startOf('day').format();
    let now = moment(new Date()).startOf('day').format();
    
    let dates;
    if(goal < now) {
        if(!endingDay){
            endingDay = moment(startDay).format();
        }
        dates = await getDates(now, endingDay);
    } else {
        if(!endingDay){
            endingDay = moment(startDay).format();
        }
        dates = await getDates(startDay, endingDay);
    }
    
    let place = await placeModel.findOne({
        city_name: city
    }).populate({
        path: 'weatherIds',
    })

    dates.map((day) => {
        place.weatherIds.map((item) => {
            let startOfTheDay = moment(new Date(item.ts.getTime() * 1000)).startOf('day').format();
            if(moment(day).startOf('day').format() == startOfTheDay) {
                rightWeather.push(item);
            }
        })
    })
    return rightWeather;
}

const update = async () => {
    let weatherData = await weatherApi.getAll();
    let city = weatherData.data.city_name
    let ids = await deleteOldAndsaveWeather(city, weatherData.data.data);

    let savedWeathers = new placeModel({
        city_name: weatherData.data.city_name,
        lon: weatherData.data.lon,
        timezone: weatherData.data.timezone,
        lat: weatherData.data.lat,
        country_code: weatherData.data.country_code,
        state_code: weatherData.data.state_code,
        weatherIds: ids
    })

    let findPlace = await placeModel.findOne({
        city_name: weatherData.data.city_name
    })
    let dbResponse;

    if (!findPlace) {
        dbResponse = savedWeathers.save();
        return "Weather saved";
    } else {
        dbResponse = await placeModel.updateOne({
            city_name: weatherData.data.city_name
        }, {
            weatherIds: ids
        })
        logger.info(dbResponse);
        return "Weather updated";
    }
}

const deleteOldAndsaveWeather = async (city, weathers) => {
    let weatherArr = [];

    await weatherModel.deleteMany({
        city: city
    })

    return Promise.all(weathers.map(async (weatherDay) => {

        let weather = await createModel(city, weatherDay);
        let savedWeather = await weather.save();
        weatherArr.push(savedWeather.id);
    })).then(() => {
        return weatherArr;
    })
}

const createModel = (city, weatherDay) => {

    let weatherObj = {
        icon: weatherDay.weather.icon,
        code: weatherDay.weather.code,
        description: weatherDay.weather.description
    }
    let weather = new weatherModel({
        moonrise_ts: weatherDay.moonrise_ts,
        wind_cdir: weatherDay.wind_cdir,
        rh: weatherDay.rh,
        pres: weatherDay.pres,
        high_temp: weatherDay.high_temp,
        sunset_ts: weatherDay.sunset_ts,
        ozone: weatherDay.ozone,
        moon_phase: weatherDay.moon_phase,
        wind_gust_spd: weatherDay.wind_gust_spd,
        snow_depth: weatherDay.snow_depth,
        clouds: weatherDay.clouds,
        ts: weatherDay.ts,
        sunrise_ts: weatherDay.sunrise_ts,
        app_min_temp: weatherDay.app_min_temp,
        wind_spd: weatherDay.wind_spd,
        pop: weatherDay.pop,
        wind_cdir_full: weatherDay.wind_cdir_full,
        slp: weatherDay.slpm,
        moon_phase_lunation: weatherDay.moon_phase_lunation,
        valid_date: weatherDay.valid_date,
        app_max_temp: weatherDay.app_max_temp,
        vis: weatherDay.vis,
        depwt: weatherDay.depwt,
        snow: weatherDay.snow,
        uv: weatherDay.uv,
        weather: weatherObj,
        wind_dir: weatherDay.wind_dir,
        max_dhi: weatherDay.max_dhi,
        clouds_hi: weatherDay.clouds_hi,
        precip: weatherDay.precip,
        low_temp: weatherDay.low_temp,
        max_temp: weatherDay.max_temp,
        moonset_ts: weatherDay.moonset_ts,
        dateteim: weatherDay.datetime,
        temp: weatherDay.temp,
        min_temp: weatherDay.min_temp,
        clouds_mid: weatherDay.clouds_mid,
        clouds_low: weatherDay.clouds_low,
        city: city
    })
    return weather;
}

module.exports = {
    getOne,
    update
};