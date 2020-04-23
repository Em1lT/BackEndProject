const helsinkiApiController = require("../Controllers/helsinkiApiController");
const eventSchema = require("./event/eventSchema");
const hslSchema = require("../schema/hsl/hslSchema");
const hslController = require("../Controllers/hslController");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    events: {
      type: new GraphQLList(eventSchema),
      description: "Get all Events",
      args: {
        limit: {
          type: GraphQLInt,
        },
        today: {
          type: GraphQLBoolean,
        },
        nameIncludes: {
          type: GraphQLString,
        },
      },
      resolve: async (parent, args) => {
        return await helsinkiApiController.getAll(
          args.limit,
          args.today,
          args.nameIncludes
        );
      },
    },
    event: {
      type: new GraphQLList(eventSchema),
      description: "Get all Events",
      args: {
        name: {
          type: GraphQLString,
        },
      },
      resolve: async (parent, args) => {
        return await helsinkiApiController.getOne(args.name);
      },
    },
    route: {
      type: hslSchema,
      args: {
        fromLat: {
          type: GraphQLFloat,
        },
        fromLon: {
          type: GraphQLFloat,
        },
        toLat: {
          type: GraphQLFloat,
        },
        toLon: {
          type: GraphQLFloat,
        },
        date: {
          type: GraphQLString,
        },
        time: {
          type: GraphQLString,
        },
        routeNumber: {
          type: GraphQLInt,
        },
      },
      resolve: async (parent, args) => {
        let from = { lat: args.fromLat, lon: args.fromLon };
        let to = { lat: args.toLat, lon: args.toLon };
        let date = args.date;
        let time = args.time 
        let data = await hslController.getRoute(from, to, date, time, args.routeNumber);
        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
