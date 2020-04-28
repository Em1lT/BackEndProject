'use strict';
const bcrypt = require('bcrypt');
const saltRound= 12; 

const location = require('../service/locationService');
const user = require('../model/userModel');
const eventModel = require('../model/helsinkiModel');
const reservation = require('../model/reservationModel');

// User functions
const getUser = async (id) => {
    try {
        let data=  await user.findById(id);
        return data;
      } catch (e) {
        return new Error(e.message);
      }
}

const registerUser = async (data) => {
    try {
        const hashPw = await bcrypt.hash(data.password, saltRound);
        const loc = await location.getLocation(data.address)
        if (!loc.locality == 'Espoo' || !loc.locality == 'Helsinki' || !loc.locality == 'Vantaa') {
          loc.coordinates[1] = 60.1675;
          loc.coordinates[0] = 24.9311;
        }
        const newUser = new user ({
          username: data.username,
          email: data.email,
          password: hashPw,
          address: {
            street_address: data.address,
            locality: loc.locality,
            coordinates: {
              lat: loc.coordinates[1],
              lon: loc.coordinates[0]
            }
          }
        })
        return newUser.save();
      } catch (e) {
        return new Error(e.message);
      }
}

const modifyUser = async (data) => {
    try {
      let update = {};
      if (data.password!==undefined) {
        const hash = await bcrypt.hash(data.password, saltRound);
        update.password = hash
      }
      if(data.address!==undefined) {
        const loc = await location.getLocation(data.address)
        if (!loc.locality == 'Espoo' || !loc.locality == 'Helsinki' || !loc.locality == 'Vantaa') {
          loc.coordinates[1] = 60.1675;
          loc.coordinates[0] = 24.9311;
        }
        const address= {
          street_address: data.address,
          locality: loc.locality,
          coordinates: {
            lat: loc.coordinates[1],
            lon: loc.coordinates[0]
          }
        }
        update.address = address
      }
      if(data.email!==undefined) {
        update.email = data.email
      }
      return await user.findByIdAndUpdate(data.id, update, {new:true});
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
          source_type: reserve.source_type,
          info_url: reserve.info_url,
          modified_at: reserve.modified_at,
          location: reserve.location,
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
const removeReservation = async (id, reservationId) => {
  try {
    const usr = await user.findById(id);
    const reservations = usr.reservations;
    const rsrvGet = await reservation.findOne({user: id, id: reservationId})
    //console.log(rsrvGet._id)
    //console.log(typeof rsrvGet._id)
    const newReservation= reservations.filter(e => e.toString() !== rsrvGet._id.toString());
    //console.log(newReservation);
    console.log("Removed reservationId: ", reservationId, 'from: ', usr.username);
    await reservation.findByIdAndDelete(rsrvGet._id.toString());
    return await user.findByIdAndUpdate(id, {reservations: newReservation}, {new:true});
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