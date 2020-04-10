const addressSchema = require('./addressSchema')


const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'location',
    description: 'lat & lon coordinates',
    fields: () => ({
        lat: {
            type: GraphQLString
        },
        lon: {
            type: GraphQLString
        },
        address: {
            type: addressSchema
        }
    })
})
