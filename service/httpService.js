"use strict";

/**
 * Basic axios service to fetch data from
 */

const axios = require("axios");
const { logger } = require("../winston");

const getData = async(url) => {
  
return await axios
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      logger.info(err);
      return err;
    });
}

module.exports = {
  getData: getData,
};
