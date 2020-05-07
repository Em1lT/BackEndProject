'use strict';
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat
} = require(
    'graphql');

const coordinates = new GraphQLObjectType({
	name: 'Coordinates',
	description: 'Lat, Lon',
	fields: () => ({
        lat: {type: GraphQLFloat},
        lon: {type: GraphQLFloat}
    })
})

module.exports = new GraphQLObjectType({
	name: 'userLocationSchema',
	description: 'Used for creating a user.',
	fields: () => ({
        street_address: {type: GraphQLString},
        locality: {type: GraphQLString},
        coordinates: {type: coordinates},
    })
})
