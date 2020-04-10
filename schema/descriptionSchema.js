const imageSchema = require('./imageSchema')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'description',
    description: 'Description of the event',
    fields: () => ({
        intro: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        images: {
            type: new GraphQLList(imageSchema)
        }
    })
})