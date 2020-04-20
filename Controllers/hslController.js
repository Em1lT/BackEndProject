const graphqlRequest = require("../service/graphlqlRequest");

const getRoute = async (from, to) => {

  const query =
    `{
        plan(
          from: {lat:` + from.lat + `, lon:` + from.lon + `}
          to: {lat: ` + to.lat + `, lon:` + to.lon + `}
          numItineraries: 1
        ) {
          itineraries {
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