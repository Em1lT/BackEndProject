const locationSchema = require('../event/locationSchema')
const nameSchema = require('../event/nameSchema')
const sourceSchema = require('../event/sourceSchema')
const eventDateSchema = require('../event/eventDateSchema')
const descriptionSchema = require('../event/descriptionSchema')
const tagsSchema = require('../event/tagsSchema')

const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} = require('graphql');

module.exports = new GraphQLObjectType({
	name: 'reservedEventSchema',
	description: 'Event reservation.',
	fields: () => ({
        _id: {type: GraphQLID},
        name: {type: nameSchema},
        id: {type: GraphQLID},
        source_type: {type: sourceSchema},
        info_url: {type: GraphQLString},
        modified_at: {type: GraphQLString},
        location: {type: locationSchema},
        description: {type: descriptionSchema},
        tags: {type: new GraphQLList(tagsSchema)},
        event_dates: {type: eventDateSchema},
        date: {type: GraphQLString}
	})
})
