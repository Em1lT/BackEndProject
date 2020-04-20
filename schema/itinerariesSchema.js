const legsSchema = require('./legsSchema')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'itineraries',
    description: 'WIP....',
    fields: () => ({
        itineraries: {
            type: new GraphQLList(legsSchema)
        }
    })
})

