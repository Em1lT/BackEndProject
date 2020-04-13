const weatherSchema = require('./weatherSchem')
const weatherController = require('../Controllers/weatherController');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,

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
            type: weatherSchema,
            args: {
                day: {
                    type: GraphQLInt
                },
                city: {
                    type: GraphQLString
                }
            },
            resolve: async (parent, args) => {

                return await weatherController.getOne(parent.starting_day, args.city)
                }
        }
    })
})