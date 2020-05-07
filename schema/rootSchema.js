'use strict'

/**
 * 
 * Root of the graphql Scema. Consists of RootQuery and mutation. SubSchemas are divide in to 5 category: event, hsl, reservation, user, weather 
 * Check for README.md for list of queries and mutations
 */

const helsinkiApiController = require("../Controllers/helsinkiApiController");
const eventSchema = require("./event/eventSchema");
const hslSchema = require("../schema/hsl/hslSchema");
const hslController = require("../Controllers/hslController");
const userSchema = require('./user/userSchema');
const reservationSchema= require('./reservation/reservationSchema');
const cleanUserSchema = require('./user/cleanUserSchema');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');
const weatherController = require('../Controllers/weatherController');
const {logger} = require('../winston');

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

/**
 * 
 * Main Query
 */
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
      resolve: async (parent, args, {req, res}) => {
      logger.info(req.method+" "+req.originalUrl+" "+ " ip:("+ req.ip +") (Authorization: "+req.get("Authorization") +")")
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
        fromLat: {type: GraphQLFloat},
        fromLon: {type: GraphQLFloat},
        toLat: {type: GraphQLFloat},
        toLon: {type: GraphQLFloat,},
        date: {type: GraphQLString},
        time: {type: GraphQLString},
        routeNumber: {type: GraphQLInt},
      },
      resolve: async (parent, args) => {
        let from = { lat: args.fromLat, lon: args.fromLon };
        let to = { lat: args.toLat, lon: args.toLon };
        let date = args.date;
        let time = args.time;
        let data = await hslController.getRoute(from, to, date, time, args.routeNumber);
        return data;
      },
    },
    user: {
      type: cleanUserSchema,
      description: 'Get user by id.',
      args: {
        id: {type: new GraphQLNonNull (GraphQLID)}
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result + ": with headers: " + req.headers)
        return await userController.getUser(args.id);
      }
    },
    users: {
      type: new GraphQLList(cleanUserSchema),
      description: 'Get users, exclude user and friends by id',
      args: {
        excludeId: {type: new GraphQLNonNull(GraphQLString)},
        nameIncludes: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (parent, args, {req, res}) => {
        logger.info(req.headers)
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.getUsers(args.excludeId, args.nameIncludes);
      }
    },
    userLogin: {
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
          logger.info({user: auth.user.username, token: auth.token});
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
    reservations: {
      type: new GraphQLList(reservationSchema),
      description: "Get all reservations.",
      resolve: async (parent, args) => {
        return userController.getReservations();
      }
    },
    reservation: {
      type: reservationSchema,
      description: "Get reservation with ObjectId.",
      args: {
        id: {type: GraphQLID}
      },
      resolve: (parent, args) => {
        return userController.getReservation(args.id);
      }
    },
    DeleteOldEvents: {
      type: GraphQLBoolean,
      description: 'Delete old reservations',
      resolve: async (parent, args) => {
        return await helsinkiApiController.DeleteOldOnes();
      }
    },
    UpdateEvents: {
      type: GraphQLString,
      description: 'Updates the reservations',
      resolve: async (parent, args) => {
        return await helsinkiApiController.update();
      }
    },
    UpdateWeather: {
      type: GraphQLString,
      description: 'Updates the weather',
      resolve: async (parent, args) => {
        return await weatherController.update();
      }
    },
  }
});

/**
 * 
 * Mutations
 */
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
      resolve: async (parent, args, {req, res}) => {
        req.body = args;
        await userController.registerUser(args);
        const auth = await authController.login(req, res);
        logger.info({user: auth.user.username, token: auth.token});
        return {
          id: auth.user._id,
          ...auth.user,
          token: auth.token,
        }
      }
    },
    UserModify: {
      type:  userSchema,
      description: 'Modify users email, address or password.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        email: {type: GraphQLString},
        address: {type: GraphQLString},
        password: {type: GraphQLString},
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.modifyUser(args);
      }
    },
    UserDelete: {
      type: cleanUserSchema,
      description: 'Delete user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.deleteUser(args.id);
      }
    },
    UserRemoveReservation: {
      type: cleanUserSchema,
      description: 'Remove reservations for user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        reservation: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        return await userController.removeReservation(args.id, args.reservation);
      }
    },
    UserAddIntrest: {
      type: cleanUserSchema,
      description: 'Add user intrest.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        intrests: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.addIntrest(args.id, args.intrests);
      }
    },
    UserRemoveIntrest: {
      type: cleanUserSchema,
      description: 'Remove intrests from user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        intrests: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.removeIntrest(args.id, args.intrests);
      }
    },
    UserAddFriend: {
      type: cleanUserSchema,
      description: 'Adds friends id to friends list.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        friends: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.addFriend(args.id, args.friends);
      }
    },
    UserRemoveFriend: {
      type: cleanUserSchema,
      description: 'Remove friend from friends list.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        friends: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async(parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.removeFriend(args.id, args.friends);
      }
    },
    UserAddReservation: {
      type: cleanUserSchema,
      description: 'Add reservations for user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        reservation: {type: new GraphQLNonNull(GraphQLString)},
        date: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(args.id, args.reservation, args.date)
        return await userController.addReservation(args.id, args.reservation, args.date);
    },
    UserRemoveReservation: {
      type: cleanUserSchema,
      description: 'Remove reservations for user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID), description: "user id"},
        reservation: {type: new GraphQLNonNull(GraphQLID), description: "reservation _id"},
      },
      resolve: async (parent, args, {req, res}) => {
        const result = await authController.checkAuth(req, res);
        logger.info(result)
        return await userController.removeReservation(args.id, args.reservation);
      }
    }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
