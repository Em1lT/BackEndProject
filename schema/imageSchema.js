licenseSchema = require("./licenseSchema")

const {
    GraphQLObjectType,
    GraphQLString,
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'image',
    description: 'Images of the event',
    fields: () => ({
        url: {
            type: GraphQLString
        },
        copyright_holder: {
            type: GraphQLString
        },
        license_type: {
            type: licenseSchema
        }
    })
})