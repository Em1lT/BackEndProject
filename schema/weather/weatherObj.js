const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat
} = require(
    'graphql');


module.exports = new GraphQLObjectType({
    name: 'weatherObj',
    description: 'weather icon object',
    fields: () => ({
        icon: {
            type: GraphQLString
        },
        code: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    }),
})
/*
icon: weatherDay.weather.icon,
        code: weatherDay.weather.code,
        description: weatherDay.weather.description
        */