'use strict';
// User schema without private data.
const userLocationSchema = require('../user/userLocationSchema'); 
const eventSchema = require('../event/eventSchema');
const reservation = require('../../model/reservationModel');

const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
	name: 'friendSchema',
	description: 'Used for fetching friend data.',
	fields: () => ({
		id: {type: GraphQLID},
		username: {type: GraphQLString},
		email: {type: GraphQLString},
		address: {type: userLocationSchema},
		intrests: {type: new GraphQLList(GraphQLString)},
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
