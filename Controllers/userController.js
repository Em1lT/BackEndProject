'use strict';
const bcrypt = require('bcrypt');
const saltRound= 12; 

const user = require('../model/userModel');
const eventModel = require('../model/helsinkiModel');
const reservation = require('../model/reservationModel');

const getUser = async (id) => {
    try {
        return await user.findById(id);
      } catch (e) {
        return new Error(e.message);
      }
}

const registerUser = async (data) => {
    try {
        const hashPw = await bcrypt.hash(data.password, saltRound);
        const newUser = new user ({
          username: data.username,
          email: data.email,
          password: hashPw,
          address: data.address,
        })
        console.log('User with username: "' + data.username + '" registered!');
        return newUser.save();
      } catch (e) {
        return new Error(e.message);
      }
}

const modifyUser = async (data) => {
    try {
        datapassword = await bcrypt.hash(data.password, saltRound);
        console.log('Modifying data of user: ', data)
        return await user.findByIdAndUpdate(data.id, data, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

const deleteUser = async (id) => {
    try {
        console.log("Deleting user with id: ", id)
        return await user.findByIdAndDelete(id);
      } catch (e) {
        return new Error(e.message);
      }
}

const addIntrest = async (id, intrest) => {
    try {
        const old = await user.findById(id);
        const newIntrest = old.intrests;
        newIntrest.push(intrests);
        console.log("Added intrests to: ", intrests, "to: ", old.username);
        return await user.findByIdAndUpdate(id, {intrests: newIntrest}, {new:true})
      } catch (e) {
        return new Error(e.message);
      }
}

const removeIntrest = async (id, intrest) => {
    try {
        const intrestList = await user.findById(id);
        const oldIntrest = intrestList.intrests;
        const newIntrest= oldIntrest.filter(e => e !== intrests);
        console.log("Removed intrest: ", intrests, 'to: ', intrestList.username);
        return await user.findByIdAndUpdate(id, {intrests: newIntrest}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

const addFriend = async (id, friends) => {
    try {
        const oldList = await user.findById(id);
        const newList = oldList.friends;
        newList.push(friends);
        console.log("Added friendId: ", friends, 'to: ', friendList.username);
        return await user.findByIdAndUpdate(id, {friends: newList}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

const removeFriend = async (id, friends) => {
    try {
        const friendList = await user.findById(id);
        const oldfriends = friendList.friends;
        const newFriends= oldfriends.filter(e => e !== friends);
        console.log("Removed friendId: ", friends, 'to: ', friendList.username);
        return await user.findByIdAndUpdate(id, {friends: newFriends}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

const addReservation = async (id, event) => {
    try {
        const reserve = await eventModel.findOne({id: event});
        const newReservation = new reservation ({
          id: reserve.id,
          name: reserve.name,
          description: reserve.description,
          tags: reserve.tags,
          event_dates: reserve.event_dates,
        });
        const newOne = await newReservation.save();
        const usr = await user.findById(id);
        const reservations = usr.reservations;
        reservations.push(newOne._id);
        return await user.findByIdAndUpdate(id, {reservations: reservations}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

module.exports = {
    getUser,
    registerUser,
    modifyUser,
    deleteUser,
    addIntrest,
    removeIntrest,
    addFriend,
    removeFriend,
    addReservation,
}