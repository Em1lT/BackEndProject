'use strict';
const weatherApi = require('../service/WeatherService');
const weatherModel = require('../model/weatherModel');
const placeModel = require('../model/placeModel');

const getOne = async (day, city) => {

    let place = await placeModel.findOne({city_name: city}).populate({path:'weatherIds'})  
 /*   let place = await placeModel.findOne({city_name: city}).populate({
        path:'weatherIds',
        match: {
            ts: {
                $gte: ts.getTime() - (12 * 60 * 60 * 1000),
                $lt: ts.getTime() + (12 * 60 * 60 * 1000)
            }
        }
    })*/


    console.log(day);
    //Tässä jotain paskaa???
    const closest = await place.weatherIds.reduce((a, b) => {
        console.log(a.ts)
        console.log(b.ts)
        return Math.abs(b.ts - day) < Math.abs(a.ts - day) ? b : a;
    });
    
    //const output = await place.weatherIds.reduce((prev, curr) => Math.abs(curr - day) < Math.abs(prev - day) ? curr : prev);
    //let weather = await weatherModel.findById({_id: place.weatherIds[day]})
    //let weather = await weatherModel.find({"ts": { $gte: day, $lt: day}}).sort({"ts":1}).limit(1);
    return closest;
}

const update = async (req, res) => {
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

    let findPlace = await placeModel.findOne({city_name: weatherData.data.city_name})
    let dbResponse;
    
    if(!findPlace){
        dbResponse = savedWeathers.save();
        res.json("Weather saved");
    } else {
        dbResponse = await placeModel.updateOne({city_name: weatherData.data.city_name}, {weatherIds: ids})
        console.log(dbResponse);
        res.json("Weather updated");
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
        code:weatherDay.weather.code,
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