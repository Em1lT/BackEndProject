'use strict';
/**
 * 
 * Schema for address.
 * Used in locationSchema
 * 
 */

const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'address',
    description: 'Address of the event',
    fields: () => ({
        street_address: {
            type: GraphQLString
        },
        postal_code: {
            type: GraphQLString
        },
        locality: {
            type: GraphQLString
        }
    })
})