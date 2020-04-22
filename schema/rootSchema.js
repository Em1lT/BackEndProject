const bcrypt = require('bcrypt');
const saltRound= 12; 

const helsinkiApiController = require("../Controllers/helsinkiApiController");
const eventSchema = require("./event/eventSchema");
const userSchema = require('./user/userSchema');
const user = require('../model/userModel');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
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
        return await helsinkiApiController.getAll(args.limit, args.today, args.nameIncludes);
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
    user_register: {
      type: userSchema,
      description: 'Register user.',
      args: {
        username: {type: new GraphQLNonNull (GraphQLString)},
        email: {type: new GraphQLNonNull (GraphQLString)},
        password: {type: new GraphQLNonNull (GraphQLString)},
        address: {type: new GraphQLNonNull (GraphQLString)},
      },
      resolve: async (parent, args, {req, res}) => {
        try {
          const hashPw = await bcrypt.hash(args.password, saltRound);
          const newUser = new user ({
            username: args.username,
            email: args.email,
            password: hashPw,
            address: args.address,
          })
          console.log('username ' + args.username + ' register done');
          return newUser.save();
        } catch (e) {
          return new Error(e.message);
        }
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
