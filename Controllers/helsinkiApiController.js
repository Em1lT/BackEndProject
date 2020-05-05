"use strict";

/**
 * 
 * Controller for getting events.
 * 
 * functions:
 * getAll
 * getOne
 * searchAndUpdate 
 * DeleteOldOnes
 * createModel
 */

const helApi = require("../service/helsinkiApi");
const helsinkiModel = require("../model/helsinkiModel");
const {logger} = require('../winston');

const update = async (req, res) => {
  let data = await helApi.getAll();
  let updated = await searchAndUpdate(data);
  return "Added "+updated+" events to db";
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
      .limit(limit ? limit : 30);
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
      .limit(limit ? limit : 30).sort("event_dates");
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
  let bad = 0;

  const added = await data.map(async (item) => {
    let dbData = await helsinkiModel.findOne({
      id: item.id,
    });
    if (!dbData) {
      if (item.event_dates.starting_day) {
        let eventModel = createModel(item);
        try {
          await eventModel.save();
          logger.info("Item Added: " + item.name.fi);
        } catch (e) {
          logger.error("Error", e);
        }
      } else {
        logger.info("no starting date " + item.name.fi);
      }
    } else {
      logger.info("already in db: " + item.name.fi);
    }
  });
  return added.length;
};

const DeleteOldOnes = async () => {
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
      logger.error("error" + e);
      return false;
    }
  });
  return true;
};


const createModel = (item) => {

  let nameModel = {
    fi: item.name.fi,
    en: item.name.en,
    en: item.name.sv,
    zv: item.name.zv
  }

  let source_typeModel = {
    id: item.source_type.id,
    name: item.source_type.name
  }

  let addressModel= {
    street_address: item.location.address.street_address,
    postal_code: item.location.address.postal_code,
    locality: item.location.address.locality
  }

  let locationModel = {
    lat: item.location.lat,
    lon: item.location.lon,
    address: addressModel
  }

  let imagesArr = [];
  let tagsModelArr = []; 
  item.tags.map((tag) => {
    let tagModel = {
      id: tag.id,
      name: tag.name
    }
    tagsModelArr.push(tagModel);
  })

  item.description.images.map((image) => {
    let license_typeModel = {
      id:image.license_type.id,
      name:image.license_type.name
    }

    let imageModel = {
       url: image.url,
       copyright_holder: image.copyright_holder,
       license_type: license_typeModel
     }
     imagesArr.push(imageModel)
  })

  let descriptionModel = {
    intro: item.description.intro,
    body: item.description.body,
    images: imagesArr
  }

  let event_datesModel = {
    starting_day: item.event_dates.starting_day,
    ending_day: item.event_dates.ending_day,
    additional_description: item.event_dates.additional_description
  }

  let eventModel = new helsinkiModel({
    id:item.id,
    name: nameModel,
    source_type: source_typeModel,
    info_url: item.info_url,
    modified_at: item.modified_at,
    location: locationModel,
    description: descriptionModel,
    tags: tagsModelArr,
    event_dates: event_datesModel,

  });
  return eventModel;
};

module.exports = {
  update,
  DeleteOldOnes,
  getAll,
  getOne,
};
