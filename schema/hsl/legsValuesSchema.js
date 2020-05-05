'use strict';
const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'legsValueSchema',
    description: 'Used to display basic info from hsl',
    fields: () => ({
        startTime: {
            type: GraphQLString
        },
        endTime: {
            type: GraphQLString
        },
        mode: {
            type: GraphQLString
        },
        duration: {
            type: GraphQLString
        },
        distance: {
            type: GraphQLString
        }
    })
})
