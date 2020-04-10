const helsinkiApiController = require('../Controllers/helsinkiApiController');
const eventSchema = require('./eventSchema')

const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt
} = require(
    'graphql');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        event: {
            type: new GraphQLList(eventSchema),
            description: 'Get all Events',
            args: {
                limit: {
                    type: GraphQLInt
                }
            },
            resolve: async (parent, args) => {
                return await helsinkiApiController.getAll(args.limit);
            },
        }
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});