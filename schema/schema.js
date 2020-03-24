'use strict';
const db = require('../service/db')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt
} = require(
    'graphql');


const sourceType = new GraphQLObjectType({
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


const nameType = new GraphQLObjectType({
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

const locationType = new GraphQLObjectType({
    name: 'location',
    description: 'lat & lon coordinates',
    fields: () => ({
        lat: {
            type: GraphQLString
        },
        lon: {
            type: GraphQLString
        },
        address: {
            type: addressType
        }
    })
})

const addressType = new GraphQLObjectType({
    name: 'address',
    description: 'Address of the event',
    fields: () => ({
        street_address: {
            type: GraphQLString
        },
        postal_code: {
            type: GraphQLString
        },
        locality: {
            type: GraphQLString
        }
    })
})


const licenseType = new GraphQLObjectType({
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

const imagesType = new GraphQLObjectType({
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
            type: licenseType
        }
    })
})

const descriptionType = new GraphQLObjectType({
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
            type: new GraphQLList(imagesType)
        }
    })
})

const tagsType = new GraphQLObjectType({
    name: 'tags',
    description: 'tags for the event',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    })
})

const eventdateTypes = new GraphQLObjectType({
    name: 'event_dates',
    description: 'event dates for the event',
    fields: () => ({
        starting_day: {
            type: GraphQLString
        },
        ending_day: {
            type: GraphQLString
        },
        additional_description: {
            type: GraphQLString
        },
    })
})

const eventType = new GraphQLObjectType({
    name: 'event',
    description: 'event description',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: nameType
        },
        source_type: {
            type: sourceType
        },
        info_url: {
            type: GraphQLString
        },
        modified_at: {
            type: GraphQLString
        },
        location: {
            type: locationType
        },
        description: {
            type: descriptionType
        },
        tags: {
            type: new GraphQLList(tagsType)
        },
        event_dates: {
            type: eventdateTypes
        }
    }),
});

const mongoType = new GraphQLObjectType({
    name: 'mongo',
    description: 'base root for all data',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        data: {
            type: eventType
        }
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        data: {
            type: new GraphQLList(mongoType),
            description: 'Get all Events',
            args: {
                limit: {
                    type: GraphQLInt
                }
            },
            resolve(parent, args) {
                return db.getSome(args.limit);
            },
        }
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});