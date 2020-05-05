const graphqlRequest = require("../service/graphlqlRequest");

/**
 * 
 * Controller for getting data from the hsl api.
 * 
 * functions:
 * getRoute
 */

const getRoute = async (from, to, date, time, routeNum) => {

  let formString;
  let toString;
  let dateString;
  let timeString;
  let routeNumString;

  if(from) {
    formString = `from: {lat: ${from.lat} , lon: ${from.lon}}`
  }

  if(to) {
    toString = `to: {lat: ${to.lat}, lon: ${to.lon}}`
  }

  if(date) {
    dateString = `date: ${date}`
  }

  if(time) {
    timeString = `time: ${date}`
  }

  if(routeNum) {
    routeNumString = `numItineraries: ${routeNum}`
  }

  const query =
    `{
        plan(
          ${formString ? formString : ""}
          ${toString ? toString : ""}
          ${dateString ? dateString: ""}       
          ${timeString ? timeString: ""}
          ${routeNumString ? routeNumString: ""}
        ) {
          itineraries {
            startTime
            endTime
            duration
            legs {
              startTime
              endTime
              mode
              duration
              realTime
              distance
              transitLeg
            }
          }
        }
      }`
  let data = await graphqlRequest.makeRequest(process.env.HSLURL, query)
  return data;
}

module.exports = {
  getRoute
}