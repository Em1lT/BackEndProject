'use strict';
const bcrypt = require('bcrypt');
const saltRound= 12; 

const user = require('../model/userModel');
const eventModel = require('../model/helsinkiModel');
const reservation = require('../model/reservationModel');

// User functions
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
      console.log(data)
      if (!data.password==null) {
        datapassword = await bcrypt.hash(data.password, saltRound);
      }
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
        const usr = await user.findById(id);
        const newIntrest = usr.intrests;
        newIntrest.push(intrest);
        console.log("Added intrests to: ", intrest, "to: ", usr.username);
        return await user.findByIdAndUpdate(id, {intrests: newIntrest}, {new:true})
      } catch (e) {
        return new Error(e.message);
      }
}

const removeIntrest = async (id, intrest) => {
    try {
        const usr = await user.findById(id);
        const oldIntrest = usr.intrests;
        const newIntrest= oldIntrest.filter(e => e !== intrest);
        console.log("Removed intrest: ", intrest, 'to: ', usr.username);
        return await user.findByIdAndUpdate(id, {intrests: newIntrest}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

const addFriend = async (id, friends) => {
    try {
        const usr = await user.findById(id);
        const newList = usr.friends;
        newList.push(friends);
        console.log("Added friendId: ", friends, 'to: ', usr.username);
        return await user.findByIdAndUpdate(id, {friends: newList}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

const removeFriend = async (id, friends) => {
    try {
        const usr = await user.findById(id);
        const oldfriends = usr.friends;
        const newFriends= oldfriends.filter(e => e !== friends);
        console.log("Removed friendId: ", friends, 'to: ', usr.username);
        return await user.findByIdAndUpdate(id, {friends: newFriends}, {new:true});
      } catch (e) {
        return new Error(e.message);
      }
}

// Create new reservation document then save to users list.
const addReservation = async (id, event) => {
    try {
        const reserve = await eventModel.findOne({id: event});
        const newReservation = new reservation ({
          id: reserve.id,
          name: reserve.name,
          description: reserve.description,
          tags: reserve.tags,
          event_dates: reserve.event_dates,
          user: id,
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

// Remove reservation document from collection and users list.
const removeReservation = async (id, eventId) => {
  try {
    const usr = await user.findById(id);
    const reservations = usr.reservations;
    const updateReservation= reservations.filter(e => e.toString() !== eventId);
    console.log("Removed eventId: ", eventId, 'from: ', usr.username);
    await reservation.findByIdAndDelete(eventId);
    return await user.findByIdAndUpdate(id, {reservations: updateReservation}, {new:true});
  } catch (e) {
    return new Error(e.message);
  }
}

// Reservation functions
const getReservations = async () => {
  try {
    return await reservation.find()
  } catch (e) {
    return new Error(e.message);
  }
}

const getReservation = async (id) => {
  try {
    return await reservation.findById(id);
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
    removeReservation,
    getReservations,
    getReservation,
}