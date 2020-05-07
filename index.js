require("dotenv").config();

/**
 *
 * This is where the server starts. Uses helmet and Graphql
 *
 */
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const rootSchema = require("./schema/rootSchema");
const helmet = require("helmet");
const { logger } = require("./winston");
const { startScheduledUpdates } = require("./admin/adminTools");
const server = require("http").Server(app);
const { connect, sendMessage } = require("./utils/socket.io.js");

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

connect(server);
app.use(cors());
app.use(helmet());
app.use("/test", (req, res) => {
  sendMessage({
    coordinates: [getRandomInRange(-180, 180, 3),getRandomInRange(-180, 180, 3)],
  });
  res.status(200).json("success");
});

app.get("/Map", function (req, res) {
  res.sendFile(__dirname + "/map.html");
});

app.use((req, res, next) => {
  next();
});

app.use("/graphql", (req, res) => {
  graphqlHTTP({ schema: rootSchema, graphiql: true, context: { req, res } })(
    req,
    res
  );
});

if (process.env.NODE_ENV === "production") {
  logger.info("cron job for updates now started");
  startScheduledUpdates();
}

server.listen(port, () => {
  logger.info(`App has started and is running on port:  ${port}!`);
});
