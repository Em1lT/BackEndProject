const addressSchema = require('./addressSchema')
const hslSchema = require('./hslSchema')
const hslController = require('../Controllers/hslController')

const {
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQlNonNull
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
        },
        route: {
            type:hslSchema,
            args: {
                lat: {
                    type: GraphQLFloat

                },
                lon: {
                    type: GraphQLFloat
                }
            },
            resolve: async (parent, args) => {
                let from = {lat: args.lat, lon: args.lon};
                let to = {lat: parent.lat, lon: parent.lon};
                let data =await hslController.getRoute(from, to);
                return data;
            },
        }
    })
})
