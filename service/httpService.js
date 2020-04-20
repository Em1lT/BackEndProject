const axios = require('axios');

function getData(url) {

    return new Promise((resolve, reject) => {
        return axios.get(url)
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                console.log(err);
                reject(err);
            })
    })
}


module.exports = {
    getData: getData
}