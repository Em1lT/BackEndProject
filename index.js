require('dotenv').config()

/**
 * 
 * This is where the server starts. Uses helmet and Graphql
 * 
 */
const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const passport = require('./utils/pass');
const rootSchema = require('./schema/rootSchema');
const db = require('./service/db');
const helmet = require('helmet');
const {logger} = require('./winston');
const { startScheduledUpdates } = require('./adminTools');

app.use(cors());
app.use(helmet());
app.use('/test',(req,res) => {
  res.status(200).json("success")
});

app.use((req, res, next) => {
    next();
  });

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
