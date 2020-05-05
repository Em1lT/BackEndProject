
/**
 * 
 * Tags of the event
 * Used in eventSchema.js
 * 
 */

const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'tags',
    description: 'tags for the event',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    })
})