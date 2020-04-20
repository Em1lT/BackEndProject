const legsValueSchema = require('./legsValuesSchema')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'legsSchema',
    description: 'Used to display basic info from hsl',
    fields: () => ({
        startTime: {
            type: GraphQLString
        },
        endTime: {
            type: GraphQLString
        },
        duration: {
            type: GraphQLString
        },
        legs: {
            type: new GraphQLList(legsValueSchema)
        }
    })
})