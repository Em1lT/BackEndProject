const addressSchema = require('./addressSchema')
const hslSchema = require('./hslSchema')
const hslController = require('../Controllers/hslController')

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
        },
        route: {
            type:hslSchema,
            resolve: async (parent, args) => {
                //Get this from the serverside. with args 
                let from = {lat: "60.220127", lon: "24.785761"};
                let to = {lat: parent.lat, lon: parent.lon};
                let data =await hslController.getRoute(from, to);
                return data;
            },
        }
    })
})
