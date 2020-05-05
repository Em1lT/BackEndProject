/**
 * 
 * Main schema for the event. Fetches the data from the mongoose db with fetch all command
 */

const locationSchema = require('./locationSchema')
const nameSchema = require('./nameSchema')
const sourceSchema = require('./sourceSchema')
const eventDateSchema = require('./eventDateSchema')
const descriptionSchema = require('./descriptionSchema')
const tagsSchema = require('./tagsSchema')
const user = require('../../model/userModel');
const reservation = require('../../model/reservationModel');
const reservedEventSchema = require('../reservation/reservationSchema')

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
            type: reservedEventSchema,
            args: {
                id: {type: GraphQLID},
            },        
            resolve: async (parent, args) => {
                try {
                    let data =await reservation.find({'user': args.id, 'id': parent.id})      
                    return data[0];
                } catch (error) {
                    return new Error(e.message)                    
                }
            }
        },
        reserved: {
            type: new GraphQLList(require('../user/cleanUserSchema')),     
            resolve: async (parent, args) => {
                try {
                    return await user.find({'_id': {$in: parent.reservedById}})
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

/*
resolve: async (parent, args) => {
				try {
				} catch (e) {
					return new Error(e.message)
				}
			}
*/