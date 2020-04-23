// User with password field, only used for registering, logging in or modifying.
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
	name: 'userSchema',
	description: 'Used for creating a user.',
	fields: () => ({
		id: {type: GraphQLID},
		username: {type: GraphQLString},
		email: {type: GraphQLString},
		password: {type: GraphQLString},
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
		reservations: {type: new GraphQLList(reservedEventSchema)},
	})
})
