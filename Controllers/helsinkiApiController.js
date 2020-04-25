"use strict";
const helApi = require("../service/helsinkiApi");
const helsinkiModel = require("../model/helsinkiModel");

const update = async (req, res) => {
  let data = await helApi.getAll();
  let updated = await searchAndUpdate(data);
  res.json("Added %s events to db" + updated);
};

const getAll = async (limit, today, nameIncludes) => {
  if (today && today === true) {
    let data = await helsinkiModel
      .find({
        "event_dates.starting_day": {
          $lte: new Date(new Date().getTime() + dayConverter(7)).toISOString(),
          $gte: new Date(new Date().getTime() - dayConverter(1)).toISOString(),
        },
      })
      .limit(3);
    return data;
  }

  if (nameIncludes) {
    let data = await helsinkiModel
      .find({
        $and: [
          {
            "event_dates.starting_day": {
                $lte: new Date(new Date().getTime() + dayConverter(15)).toISOString(),
              },
              "event_dates.ending_day": {
                $lte: new Date(new Date().getTime() + dayConverter(15)).toISOString(),
                $gte: new Date(new Date().getTime() - dayConverter(1)).toISOString(),
              },
          },
          {
            $or: [
              {
                "name.fi": {
                  $regex: nameIncludes,
                },
              },
              {
                "tags.name": {
                  $regex: nameIncludes,
                },
              },
            ],
          },
        ],
      })
      .limit(20).sort("event_dates");
    return data;
  }

  //Find events that start 2 weeks into the future -> this because we will only also to show them weather included
  let data = await helsinkiModel
    .find({
      "event_dates.starting_day": {
        $lte: new Date(new Date().getTime() + dayConverter(15)).toISOString(),
      },
      "event_dates.ending_day": {
        $lte: new Date(new Date().getTime() + dayConverter(15)).toISOString(),
        $gte: new Date(new Date().getTime() - dayConverter(1)).toISOString(),
      },
    })
    .limit(limit ? limit : 10)
    .sort("event_dates");
  return data;
};

const dayConverter = (days) => {
  return days * 60 * 60 * 24 * 1000;
};
const getOne = async (name) => {
  //getOne from the database with the id
  let data = await helsinkiModel.find({ id: name });
  return data;
};

const searchAndUpdate = async (data) => {
  let Added = 0;

  await data.map(async (item) => {
    let dbData = await helsinkiModel.findOne({
      id: item.id,
    });
    console.log(dbData);
    if (!dbData) {
      if (item.event_dates.starting_day) {
        let eventModel = createModel(item);
        Added++;
        console.log(Added + ". item Added: " + item.name.fi);
        try {
          await eventModel.save();
        } catch (e) {
          console.log("Error", e);
        }
      } else {
        console.log("no starting date " + item.name.fi);
      }
    } else {
      console.log("already in db: " + item.name.fi);
    }
  });
  return Added;
};

const createModel = (item) => {
  let eventModel = new helsinkiModel(item);
  return eventModel;
};

const DeleteOldOnes = async (req, res) => {
  let data = await helsinkiModel.find({});
  let deletedID = 0;

  await data.map(async (event) => {
    let ts = new Date(new Date().getTime() * 1000).getTime();
    try {
      if (!event.event_dates.starting_day || !event.event_dates.ending_day) {
        deletedID++;
        await helsinkiModel.deleteOne({
          id: event.id,
        });
      } else if (
        event.event_dates.starting_day.getTime() < ts &&
        event.event_dates.ending_day.getTime() < ts
      ) {
        deletedID++;
        await helsinkiModel.deleteOne({
          id: event.id,
        });
      }
    } catch (e) {
      console.log("error" + e);
    }
  });
  res.json("Number of deleted items:" + deletedID);
};

module.exports = {
  update,
  DeleteOldOnes,
  getAll,
  getOne,
};
