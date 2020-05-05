

/**
 * 
 * Event dates
 * Used in eventSchema.js
 */

const weatherSchema = require('../weather/weatherSchem')
const weatherController = require('../../Controllers/weatherController');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'event_dates',
    description: 'event dates for the event',
    fields: () => ({
        starting_day: {
            type: GraphQLString
        },
        ending_day: {
            type: GraphQLString
        },
        additional_description: {
            type: GraphQLString
        },
        weather: {
            type:  new GraphQLList(weatherSchema),
            args: {
                day: {
                    type: GraphQLInt
                },
                city: {
                    type: GraphQLString
                }
            },
            resolve: async (parent, args) => {

                return await weatherController.getOne(parent.starting_day, parent.ending_day, args.city)
                }
        }
    })
})