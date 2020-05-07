let cron = require("node-cron");
const { logger } = require("../winston");
const helsinkiApiController = require("../Controllers/helsinkiApiController");
const weatherController = require("../Controllers/weatherController");


module.exports = startScheduledUpdates = async () => {
  let crons = cron.schedule("0 18 * * *", async () => {
    await helsinkiApiController.DeleteOldOnes();
    await helsinkiApiController.update();
    await weatherController.update();
  });
  crons.start();
}

/*
 
 deleteOldEvents: {
      type: GraphQLBoolean,
      description: 'Delete old reservations',
      resolve: async (parent, args) => {
        return await helsinkiApiController.DeleteOldOnes();
      }
    },
    updateEvents: {
      type: GraphQLString,
      description: 'Updates the reservations',
      resolve: async (parent, args) => {
        return await helsinkiApiController.update();
      }
    },
    updateWeather: {
      type: GraphQLString,
      description: 'Updates the weather',
      resolve: async (parent, args) => {
        return await weatherController.update();
      }
    }*/
