// User schema without private data.
const reservedEventSchema = require('../reservation/reservationSchema')

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
		intrests: {type: new GraphQLList(GraphQLString)},
		reservations: {type: new GraphQLList(reservedEventSchema)},
	})
})
