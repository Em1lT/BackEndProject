require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const passport = require('./utils/pass');
const rootSchema = require('./schema/rootSchema');
const db = require('./service/db');
app.use(cors());

app.use((req, res, next) => {
    next();
  });

app.use('/graphql', (req, res) => {
    graphqlHTTP({schema: rootSchema, graphiql: true, context: {req, res}})
    (req, res);
  });
  
app.listen(port, () => console.log(`App has started and is running on port:  ${port}!`))
