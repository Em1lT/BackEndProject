const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'license',
    description: 'License of the event',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    })
})