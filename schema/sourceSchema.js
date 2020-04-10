const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'source',
    description: 'source type',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        }
    }),
});