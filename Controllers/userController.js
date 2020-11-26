"use strict";

/**
 *
 * Controller to user.
 *
 * functions:
 * getUser
 * getUsers
 * registerUser
 * modifyUser
 * deleteUser
 * addIntrest
 * removeIntrest
 * addFriend
 * removeFriend
 * addReservation
 * removeReservation
 * getReservations
 * getReservation
 */

const bcrypt = require("bcrypt");
const saltRound = 12;
const { logger } = require("../winston");

const location = require("../service/locationService");
const user = require("../model/userModel");
const eventModel = require("../model/helsinkiModel");
const reservation = require("../model/reservationModel");

// User functions
const getUser = async (id) => {
  try {
    let data = await user.findById(id);
    return data;
  } catch (e) {
    return new Error(e.message);
  }
};

// Removes excId user and its friends from result
const renderSelf = async (users, excId) => {
  const currentUser = await getUser(excId);
  const friends = currentUser.friends;
  let notFriends = [];
  for (let i in users) {
    if (friends.includes(users[i].id)) {
      //Already on friendslist dont push
    } else if (users[i].id == excId) {
      // Current user dont push to list
    } else {
      notFriends.push(users[i]);
    }
  }
  return notFriends;
};

const getUsers = async (exclude, nameIncludes) => {
  try {
    let data = await user.find({
      $or: [
        { username: { $regex: nameIncludes } },
        { email: { $regex: nameIncludes } },
        { "address.locality": { $regex: nameIncludes } },
      ],
    });
    data = renderSelf(data, exclude);
    return data;
  } catch (e) {
    return new Error(e.message);
  }
};

const registerUser = async (data) => {
  try {
    const hashPw = await bcrypt.hash(data.password, saltRound);
    const loc = await location.getLocation(data.address);
    if (
      !loc.locality == "Espoo" ||
      !loc.locality == "Helsinki" ||
      !loc.locality == "Vantaa"
    ) {
      loc.coordinates[1] = 60.1675;
      loc.coordinates[0] = 24.9311;
    }
    const newUser = new user({
      username: data.username,
      email: data.email,
      password: hashPw,
      address: {
        street_address: data.address,
        locality: loc.locality.toLowerCase(),
        coordinates: {
          lat: loc.coordinates[1],
          lon: loc.coordinates[0],
        },
      },
    });
    return newUser.save();
  } catch (e) {
    return new Error(e.message);
  }
};

const modifyCheck = async (pw, adrs, em) => {
  let update = {};
  // Check password field
  if (pw || pw == "") {
    //Do Nothing
  } else if (pw !== undefined) {
    const hash = await bcrypt.hash(pw, saltRound);
    update.password = hash;
  }
  // Check address field
  if (adrs == "") {
    //Do Nothing
  } else if (adrs !== undefined) {
    const loc = await location.getLocation(adrs);
    if (
      !loc.locality == "Espoo" ||
      !loc.locality == "Helsinki" ||
      !loc.locality == "Vantaa"
    ) {
      loc.coordinates[1] = 60.1675;
      loc.coordinates[0] = 24.9311;
    }
    const address = {
      street_address: adrs,
      locality: loc.locality,
      coordinates: {
        lat: loc.coordinates[1],
        lon: loc.coordinates[0],
      },
    };
    update.address = address;
  }
  // Check email field
  if (em == "") {
    //Do nothing
  } else if (em !== undefined) {
    update.email = em;
  }
  return update;
};

const modifyUser = async (data) => {
  try {
    const update = await modifyCheck(data.password, data.address, data.email);
    return await user.findByIdAndUpdate(data.id, update, { new: true });
  } catch (e) {
    return new Error(e.message);
  }
};

const deleteUser = async (id) => {
  try {
    logger.info("Deleting user with id: ", id);
    return await user.findByIdAndDelete(id);
  } catch (e) {
    return new Error(e.message);
  }
};

const addIntrest = async (id, intrest) => {
  try {
    const usr = await user.findById(id);
    const newIntrest = usr.intrests;
    newIntrest.push(intrest);
    logger.info("Added intrests to: ", intrest, "to: ", usr.username);
    return await user.findByIdAndUpdate(
      id,
      { intrests: newIntrest },
      { new: true }
    );
  } catch (e) {
    return new Error(e.message);
  }
};

const removeIntrest = async (id, intrest) => {
  try {
    const usr = await user.findById(id);
    const oldIntrest = usr.intrests;
    const newIntrest = oldIntrest.filter((e) => e !== intrest);
    logger.info("Removed intrest: ", intrest, "to: ", usr.username);
    return await user.findByIdAndUpdate(
      id,
      { intrests: newIntrest },
      { new: true }
    );
  } catch (e) {
    return new Error(e.message);
  }
};

const addFriend = async (id, friends) => {
  try {
    const usr = await user.findById(id);
    const newList = usr.friends;
    newList.push(friends);
    logger.info("Added friendId: ", friends, "to: ", usr.username);
    return await user.findByIdAndUpdate(
      id,
      { friends: newList },
      { new: true }
    );
  } catch (e) {
    return new Error(e.message);
  }
};

const removeFriend = async (id, friends) => {
  try {
    const usr = await user.findById(id);
    const oldfriends = usr.friends;
    const newFriends = oldfriends.filter((e) => e !== friends);
    logger.info("Removed friendId: ", friends, "to: ", usr.username);
    return await user.findByIdAndUpdate(
      id,
      { friends: newFriends },
      { new: true }
    );
  } catch (e) {
    return new Error(e.message);
  }
};

// Create new reservation document then save to users list.
const addReservation = async (id, event, date) => {
  try {
    const reserve = await eventModel.findOne({ id: event });
    const alreadyReserved = await reservation.findOne({
      id: reserve.id,
      user: id,
    });

    if (!alreadyReserved) {
      const newReservation = new reservation({
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
        date: date,
      });
      //Add marker to event field

      const newOne = await newReservation.save();
      const usr = await user.findById(id);
      const reservations = usr.reservations;
      reservations.push(newOne._id);
      await eventModel.updateOne({ id: reserve.id }, { reservedById: id });
      return await user.findByIdAndUpdate(
        id,
        { reservations: reservations },
        { new: true }
      );
    } else {
      return new Error("Already reserved!");
    }
  } catch (e) {
    logger.error(e.message);
    return new Error(e.message);
  }
};

// Remove reservation document from collection and users list.
const removeReservation = async (id, reservationId) => {
  try {
    const usr = await user.findById(id);
    const reservations = usr.reservations;
    const rsrvGet = await reservation.findOne({ user: id, id: reservationId });
    const newReservation = reservations.filter(
      (e) => e.toString() !== rsrvGet._id.toString()
    );
    logger.info(
      "Removed reservationId: ",
      reservationId,
      "from: ",
      usr.username
    );
    await reservation.findByIdAndDelete(rsrvGet._id.toString());
    await eventModel.findOneAndUpdate(
      { id: reservationId },
      { $pull: { reservedById: id } }
    );
    return await user.findByIdAndUpdate(
      id,
      { reservations: newReservation },
      { new: true }
    );
  } catch (e) {
    return new Error(e.message);
  }
};

// Reservation functions
const getReservations = async () => {
  try {
    return await reservation.find();
  } catch (e) {
    return new Error(e.message);
  }
};

const getReservation = async (id) => {
  try {
    return await reservation.findById(id);
  } catch (e) {
    return new Error(e.message);
  }
};

module.exports = {
  getUser,
  getUsers,
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
};
