'use strict';

/**
 * ALl of the request are going through here
 * 
 */
const graphqlClient = require('graphql-request');
const {logger} = require('../winston');


const makeRequest = (url, query) => {
    return graphqlClient.request(url, query).then(data => {
        return data
    }).catch((err) => {
        logger.info(err);
    })
}

module.exports = {
    makeRequest
}