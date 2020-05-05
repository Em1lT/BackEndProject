const axios = require('axios');
const {logger} = require('../winston');

function getData(url) {

    return new Promise((resolve, reject) => {
        return axios.get(url)
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                logger.info(err);
                reject(err);
            })
    })
}


module.exports = {
    getData: getData
}