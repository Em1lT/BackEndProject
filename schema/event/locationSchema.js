const addressSchema = require('./addressSchema')
const hslSchema = require('../hsl/hslSchema')
const hslController = require('../../Controllers/hslController')

const {
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull
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
                fromLat: {type:  new GraphQLNonNull(GraphQLFloat)},
                fromLon: {type: new GraphQLNonNull(GraphQLFloat)},
                date: {type: GraphQLString},
                time: {type: GraphQLString},
            },
            resolve: async (parent, args) => {
                let from = {lat: args.fromLat, lon: args.fromLon};
                let to = {lat: parent.lat, lon: parent.lon};
                let date = args.date;
                let time = args.time;
                let data =await hslController.getRoute(from, to,date, time);
                return data;
            },
        }
    })
})
