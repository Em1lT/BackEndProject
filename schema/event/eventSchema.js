const locationSchema = require('./locationSchema')
const nameSchema = require('./nameSchema')
const sourceSchema = require('./sourceSchema')
const eventDateSchema = require('./eventDateSchema')
const descriptionSchema = require('./descriptionSchema')
const tagsSchema = require('./tagsSchema')

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
        tags: {
            type: new GraphQLList(tagsSchema)
        },
        event_dates: {
            type: eventDateSchema
        }
    }),
});