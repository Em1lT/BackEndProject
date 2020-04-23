// User schema without password field.
const reservedEventSchema = require('../reservation/reservedEventSchema')
const friendSchema = require('./friendSchema');
const addressSchema = require('../event/addressSchema')
const user = require('../../model/userModel');

const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
	name: 'cleanUserSchema',
	description: 'Used for fetching a user.',
	fields: () => ({
		id: {type: GraphQLID},
		username: {type: GraphQLString},
		email: {type: GraphQLString},
		address: {type: GraphQLString}, // Get from hsl after
		intrests: {type: new GraphQLList(GraphQLString)},
		friends: {
			type: new GraphQLList(friendSchema),
			resolve: async (parent, args) => {
				try {
					return await user.find({'_id': {$in: parent.friends}})
				} catch (e) {
					return new Error(e.message)
				}
			}
		},
		reservations: {type: new GraphQLList(reservedEventSchema),
		
		},
	})
})
