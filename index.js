'use strict';
require('dotenv').config()

/**
 * 
 * This is where the server starts. Uses helmet and Graphql
 * 
 */
const express = require('express')
const app = express()
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const rootSchema = require('./schema/rootSchema');
const helmet = require('helmet');
const {logger} = require('./winston');
const { startScheduledUpdates } = require('./adminTools');
const db = require('./service/db');

app.use(cors());
app.use(helmet());
app.use('/test',(req,res) => {
  res.status(200).json("success")
});

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  const port = 3000;
  require('./production')(app,port);
} else {
  const port = 3001;
  require('./development')(app,port);
}

app.use('/graphql', (req, res) => {
    graphqlHTTP({schema: rootSchema, graphiql: true, context: {req, res}})
    (req, res);
});

if (process.env.NODE_ENV === 'production') {
  logger.info("cron job for updates now started");
  startScheduledUpdates();
}
