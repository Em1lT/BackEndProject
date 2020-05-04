const friendSchema = require('./friendSchema');
const user = require('../../model/userModel');
const userLocationSchema = require('./userLocationSchema');
const reservation = require('../../model/reservationModel');
const eventSchema = require('../event/eventSchema')

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
		address: {type: userLocationSchema},
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
		reservations: {
			type: new GraphQLList(eventSchema),
			resolve: async (parent, args) => {
				try {
					return await reservation.find({'_id': {$in: parent.reservations}})
				} catch (e) {
					return new Error(e.message)
				}
			}
		},
	})
})
