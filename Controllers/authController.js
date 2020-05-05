'use strict';
/**
 * 
 * Controller to control authentication.
 * functions:
 * login 
 * checkAuth
 */

const jwt = require('jsonwebtoken');
const passport = require('passport');
const {logger} = require('../winston');

const login = (req, res) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', {session: false},
          async (err, user, info) => {
            try {
                logger.info('controller info', info);
              if (err || !user) {
                reject(info.message);
              }
              req.login(user, {session: false}, async (err) => {
                if (err) {
                  reject(err);
                }
                const token = jwt.sign(user, 'eventSecret');
                resolve({user, token});
              });
            }
            catch (e) {
              reject(e.message);
            }
          })(req, res);
    });
  };
  
  const checkAuth = (req, res) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', (err, user) => {
        if (err || !user) {
          reject('Not authenticated');
        }
        resolve(user);
      })(req, res);
    });
  };
  
  module.exports = {
    login,
    checkAuth,
  };
  