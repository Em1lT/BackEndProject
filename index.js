'use strict';
require('dotenv').config()

/**
 * 
 * This is where the server starts. Uses helmet and Graphql
 * 
 */
const express = require('express')
const app = express()
const port = 3001;
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
  require('./production')(app);
  port = 3000;
} else {
  require('./development')(app);
}

app.use('/graphql', (req, res) => {
    graphqlHTTP({schema: rootSchema, graphiql: true, context: {req, res}})
    (req, res);
});

if (process.env.NODE_ENV === 'production') {
  logger.info("cron job for updates now started");
  startScheduledUpdates();
}

app.listen(port, () => {  
  logger.info(`App has started and is running on port:  ${port}!`)
})
