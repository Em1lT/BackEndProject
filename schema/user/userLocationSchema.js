const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
	name: 'userLocationSchema',
	description: 'Used for creating a user.',
	fields: () => ({
        street_address: {type: GraphQLString},
        coordinates: {type: new GraphQLList(GraphQLFloat)},
    })
})
