const bcrypt = require('bcrypt');
const saltRound= 12; 

const helsinkiApiController = require("../Controllers/helsinkiApiController");
const eventSchema = require("./event/eventSchema");
const hslSchema = require("../schema/hsl/hslSchema");
const hslController = require("../Controllers/hslController");
const userSchema = require('./user/userSchema');
const cleanUserSchema = require('./user/cleanUserSchema');
const authController = require('../Controllers/authController');
const user = require('../model/userModel');

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
    User: {
      type: cleanUserSchema,
      description: 'Get user by id.',
      args: {
        id: {type: new GraphQLNonNull (GraphQLID)}
      },
      resolve: async (parent, args) => {
        try {
          return await user.findById(args.id);
        } catch (e) {
          return new Error(e.message);
        }
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
        try {
          const hashPw = await bcrypt.hash(args.password, saltRound);
          const newUser = new user ({
            username: args.username,
            email: args.email,
            password: hashPw,
            address: args.address,
          })
          console.log('User with username: "' + args.username + '" registered!');
          return newUser.save();
        } catch (e) {
          return new Error(e.message);
        }
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
        try {
          args.password = await bcrypt.hash(args.password, saltRound);
          console.log('Modifying data of user: ', args)
          return await user.findByIdAndUpdate(args.id, args, {new:true});
        } catch (e) {
          return new Error(e.message);
        }
      }
    },
    UserDelete: {
      type: cleanUserSchema,
      description: 'Delete user.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async (parent, args) => {
        try {
          console.log("Deleting user with id: ", args.id)
          return await user.findByIdAndDelete(args.id);
        } catch (e) {
          return new Error(e.message);
        }
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
        try {
          const old = await user.findById(args.id);
          const newIntrest = old.intrests;
          newIntrest.push(args.intrests);
          console.log("Added intrests to: ", args.intrests, "to: ", old.username);
          return await user.findByIdAndUpdate(args.id, {intrests: newIntrest}, {new:true})
        } catch (e) {
          return new Error(e.message);
        }
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
        try {
          const intrestList = await user.findById(args.id);
          const oldIntrest = intrestList.intrests;
          const newIntrest= oldIntrest.filter(e => e !== args.intrests);
          console.log("Removed intrest: ", args.intrests, 'to: ', intrestList.username);
          return await user.findByIdAndUpdate(args.id, {intrests: newIntrest}, {new:true});
        } catch (e) {
          return new Error(e.message);
        }
      }
    },
    UserAddFriend: {
      type: cleanUserSchema,
      description: 'Adds friends id to friends list.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        friends: {type: GraphQLID},
      },
      resolve: async ( parent, args) => {
        try {
          const oldList = await user.findById(args.id);
          const newList = oldList.friends;
          newList.push(args.friends);
          console.log("Added friendId: ", args.friends, 'to: ', friendList.username);
          return await user.findByIdAndUpdate(args.id, {friends: newList}, {new:true});
        } catch (e) {
          return new Error(e.message);
        }
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
        try {
          const friendList = await user.findById(args.id);
          const oldfriends = friendList.friends;
          const newFriends= oldfriends.filter(e => e !== args.friends);
          console.log("Removed friendId: ", args.friends, 'to: ', friendList.username);
          return await user.findByIdAndUpdate(args.id, {friends: newFriends}, {new:true});
        } catch (e) {
          return new Error(e.message);
        }
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
