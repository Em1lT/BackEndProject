const eventDateSchema = require('../event/eventDateSchema');
const nameSchema = require('../event/nameSchema');
const descriptionSchema = require('../event/descriptionSchema');

const {
    GraphQLID,
    GraphQLObjectType,
} = require('graphql');

module.exports = new GraphQLObjectType({
	name: 'reservedEventSchema',
	description: 'Event reservation.',
	fields: () => ({
        id: {type: GraphQLID},
        event_dates: {type: eventDateSchema},
        name: {type: nameSchema},
        description: {type: descriptionSchema},
	})
})