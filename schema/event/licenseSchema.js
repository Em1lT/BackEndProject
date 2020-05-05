
/**
 * 
 * License for the images
 * Used in imageSchema.js
 */

const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'license',
    description: 'License of the images',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    })
})