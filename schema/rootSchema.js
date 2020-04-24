

const helsinkiApiController = require("../Controllers/helsinkiApiController");
const eventSchema = require("./event/eventSchema");
const hslSchema = require("../schema/hsl/hslSchema");
const hslController = require("../Controllers/hslController");
const userSchema = require('./user/userSchema');
const cleanUserSchema = require('./user/cleanUserSchema');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
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
    User: {
      type: cleanUserSchema,
      description: 'Get user by id.',
      args: {
        id: {type: new GraphQLNonNull (GraphQLID)}
      },
      resolve: async (parent, args) => {
        return await userController.getUser(args.id);
      }
    },
    UserLogin: {
      type: userSchema,
      description: 'User login to receive token.',
      args: {
        username: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: async (parent, args, {req, res}) => {
        req.body = args;
        try {
          const auth = await authController.login(req, res);
          console.log({user: auth.user.username, token: auth.token});
          return {
            id: auth.user._id,
            ...auth.user,
            token: auth.token,
          }
        } catch (e) {
          throw new Error(e)
        }
      }
    },
  }
});

const Mutation = new GraphQLObjectType ({
  name: 'MutationType',
  description: 'Mutate user.',
  fields: () => ({
    UserRegister: {
      type: userSchema,
      description: 'Register a new user.',
      args: {
        username: {type: new GraphQLNonNull (GraphQLString)},
        email: {type: new GraphQLNonNull (GraphQLString)},
        password: {type: new GraphQLNonNull (GraphQLString)},
        address: {type: new GraphQLNonNull (GraphQLString)},
      },
      resolve: async (parent, args) => {
        return await userController.registerUser(args);
      }
    },
    // TODO: add checkAuth later, not yet since makes testing annoying
    UserModify: {
      type:  userSchema,
      description: 'Modify users email, address or password.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        email: {type: GraphQLString},
        address: {type: GraphQLString},
        password: {type: GraphQLString},
      },
      // resolve: async (parent, args, {req, res, checkAuth}
      resolve: async (parent, args) => {
        return await userController.modifyUser(args);
      }
    },
    UserDelete: {
      type: cleanUserSchema,
      description: 'Delete user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async (parent, args) => {
        return await userController.deleteUser(args.id);
      }
    },
    UserAddIntrest: {
      type: cleanUserSchema,
      description: 'Add user intrest.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        intrests: {type: GraphQLString}
      },
      resolve: async (parent, args) => {
        return await userController.addIntrest(args.id, args.intrests);
      }
    },
    UserRemoveIntrest: {
      type: cleanUserSchema,
      description: 'Remove intrests from user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        intrests: {type: GraphQLString}
      },
      resolve: async (parent, args) => {
        return await userController.removeIntrest(args.id, args.intrests);
      }
    },
    UserAddFriend: {
      type: cleanUserSchema,
      description: 'Adds friends id to friends list.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        friends: {type: GraphQLID},
      },
      resolve: async (parent, args) => {
        return await userController.addFriend(args.id, args.friends);
      }
    },
    UserRemoveFriend: {
      type: cleanUserSchema,
      description: 'Remove friend from friends list.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        friends: {type: GraphQLID}
      },
      resolve: async(parent, args) => {
        return await userController.removeFriend(args.id, args.friends);
      }
    },
    UserAddReservation: {
      type: cleanUserSchema,
      description: 'Add reservations for user.',
      args: {
        id: {type: GraphQLID},
        event: {type: GraphQLString},
      },
      resolve: async (parent, args) => {
        return await userController.addReservation(args.id, args.event);
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
