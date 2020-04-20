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
    name: 'weather',
    description: 'weather description',
    fields: () => ({
        moonrise_ts: {
            type: GraphQLInt
        },
        wind_cdir: {
            type: GraphQLString
        },
        rh: {
            type: GraphQLInt
        },
        pres: {
            type: GraphQLFloat
        },
        high_temp: {
            type: GraphQLFloat
        },
        sunset_ts: {
            type: GraphQLInt
        },
        ozone: {
            type: GraphQLFloat
        },
        moon_phase: {
            type: GraphQLFloat
        },
        wind_gust_spd: {
            type: GraphQLFloat
        },
        snow_depth: {
            type: GraphQLFloat
        },
        clouds: {
            type: GraphQLInt
        },
        ts: {
            type: GraphQLString
        },
        sunrise_ts: {
            type: GraphQLInt
        },
        app_min_temp: {
            type: GraphQLFloat
        },
        wind_spd: {
            type: GraphQLFloat
        },
        pop: {
            type: GraphQLInt
        },
        wind_cdir_full: {
            type: GraphQLString
        },
        moon_phase_lination: {
            type: GraphQLFloat
        },
        valid_date: {
            type:GraphQLString
        },
        app_max_temp: {
            type: GraphQLFloat
        },
        vis: {
            type: GraphQLFloat
        },
        snow: {
            type: GraphQLInt
        },
        uv: {
            type: GraphQLFloat
        },
        wind_dir: {
            type: GraphQLInt
        },
        max_dhi: {
            type: GraphQLFloat
        },
        clouds_hi: {
            type: GraphQLInt
        },
        precip: {
            type: GraphQLFloat
        },
        low_temp: {
            type: GraphQLFloat
        },
        max_temp: {
            type: GraphQLFloat
        },
        moonset_ts: {
            type: GraphQLInt
        },
        temp: {
            type: GraphQLFloat
        },
        min_temp: {
            type: GraphQLFloat
        },
        clouds_mid: {
            type: GraphQLInt
        },
        clouds_low: {
            type: GraphQLInt
        },
        city: {
            type: GraphQLString
        }
    }),
})