const eventDateSchema = require('../event/eventDateSchema');
const nameSchema = require('../event/nameSchema');
const tagsSchema = require('../event/tagsSchema');
const descriptionSchema = require('../event/descriptionSchema');

const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
} = require('graphql');

module.exports = new GraphQLObjectType({
	name: 'reservedEventSchema',
	description: 'Event reservation.',
	fields: () => ({
        id: {type: GraphQLID},
        name: {type: nameSchema},
        description: {type: descriptionSchema},
        tags: {type: new GraphQLList(tagsSchema)},
        event_dates: {type: eventDateSchema},
	})
})
