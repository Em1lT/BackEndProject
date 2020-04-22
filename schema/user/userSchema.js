const eventSchema = require('../event/eventSchema')
const addressSchema = require('../event/addressSchema')
const tagsSchema = require('../event/tagsSchema')

const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
	name: 'userSchema',
	description: 'Used for creating a user.',
	fields: () => ({
		id: {type: GraphQLID},
		username: {type: GraphQLString},
		email: {type: GraphQLString},
		password: {type: GraphQLString},
		address: {type: GraphQLString}, // Get from hsl after
		intrests: {type: new GraphQLList(tagsSchema)},
		friends: {type: new GraphQLList(GraphQLID)},
		reservations: {type: new GraphQLList(eventSchema)},
	})
})