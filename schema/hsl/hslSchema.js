'use strict';
const itinerariesSchema = require('./itinerariesSchema')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'hslSchema',
    description: 'This is used to get route data to destination',
    fields: () => ({
        plan: {
            type: itinerariesSchema
        }
    })
})
