const graphqlClient = require('graphql-request');


const makeRequest = (url, query) => {
    return graphqlClient.request(url, query).then(data => {
        return data
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = {
    makeRequest
}