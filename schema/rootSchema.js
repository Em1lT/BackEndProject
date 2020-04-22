const bcrypt = require('bcrypt');
const saltRound= 12; 

const helsinkiApiController = require("../Controllers/helsinkiApiController");
const eventSchema = require("./event/eventSchema");
const userSchema = require('./user/userSchema');
const authController = require('../Controllers/authController');
const user = require('../model/userModel');

const {
  GraphQLObjectType,
  GraphQLID,
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
    UserGet: {
      type: userSchema,
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
    }
  },
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
    // TODO: add checkAuth
    UserModify: {
      type:  userSchema,
      description: 'Modify users email, address or password. Need user id.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        email: {type: GraphQLString},
        address: {type: GraphQLString},
        password: {type: GraphQLString},
      },
      // resolve: async (parent, args, {req, res, checkAuth}
      resolve: async (parent, args, {req, res}) => {
        try {
          args.password = await bcrypt.hash(args.password, saltRound);
          return await user.findByIdAndUpdate(args.id, args, {new:true});
        } catch (e) {
          return new Error(e.message);
        }
      }
    },
    UserDelete: {
      type: userSchema,
      description: 'Delete user. Need user id.',
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: async (parent, args, {req, res}) => {
        try {
          console.log("Deleted user with id: ", args.id)
          return await user.findByIdAndDelete(args.id);
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
