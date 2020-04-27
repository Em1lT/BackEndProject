const locationSchema = require('./locationSchema')
const nameSchema = require('./nameSchema')
const sourceSchema = require('./sourceSchema')
const eventDateSchema = require('./eventDateSchema')
const descriptionSchema = require('./descriptionSchema')
const tagsSchema = require('./tagsSchema')
const reservation = require('../../model/reservationModel');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'event',
    description: 'event description',
    fields: () => ({
        _id:{
            type: GraphQLID
        },
        id: {
            type: GraphQLID
        },
        name: {
            type: nameSchema
        },
        source_type: {
            type: sourceSchema
        },
        info_url: {
            type: GraphQLString
        },
        modified_at: {
            type: GraphQLString
        },
        location: {
            type: locationSchema
        },
        description: {
            type: descriptionSchema
        },
        createdAt: {
            type: GraphQLString
        },
        updatedAt: {
            type: GraphQLString
        },
        reservedById: {
            type: new GraphQLList(GraphQLID),
            resolve: async (parent, args) => {
				try {
					return await reservation.find({'_id': {$in: parent.reservations}})
				} catch (e) {
					return new Error(e.message)
				}
			}
        },
        tags: {
            type: new GraphQLList(tagsSchema)
        },
        event_dates: {
            type: eventDateSchema
        }
    }),
});