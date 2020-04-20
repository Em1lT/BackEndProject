const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt
} = require(
    'graphql');

module.exports = new GraphQLObjectType({
    name: 'name',
    description: 'Multilanguage option ',
    fields: () => ({
        fi: {
            type: GraphQLString
        },
        en: {
            type: GraphQLString
        },
        sv: {
            type: GraphQLString
        },
        zh: {
            type: GraphQLString
        }
    }),
});