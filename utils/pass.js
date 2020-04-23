'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require('../model/userModel');

passport.use(new Strategy(
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({username});
        console.log('Local strategy login: ', user.username);
        if (user === null) {
          return done(null, false, {message: 'Incorrect username.'});
        }
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        const cleanUser = user.toObject();
        delete cleanUser.password;
        return done(null, cleanUser, {message: 'Logged In Successfully'});
      }
      catch (err) {
        return done(err);
      }
    }));

passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'eventSecret',
    },
    async (jwtPayload, done) => {
      console.log('payload', jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        const user = await userModel.findById(jwtPayload._id,
            '-password -__v');
        console.log('pl user', user);
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
      catch (e) {
        return done(null, false);
      }
    },
));

module.exports = passport;
