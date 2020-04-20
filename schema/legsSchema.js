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
        legs: {
            type: new GraphQLList(legsValueSchema)
        }
    })
})
