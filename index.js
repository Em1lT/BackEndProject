require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const passport = require('./utils/pass');
const rootSchema = require('./schema/rootSchema');
const helsinkiApiController = require('./Controllers/helsinkiApiController');
const weatherController = require('./Controllers/weatherController');
const hslApiController = require('./Controllers/hslController');
const db = require('./service/db');
const {logger} = require('./winston');

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  
app.get('/update', helsinkiApiController.update);
app.get('/delete', helsinkiApiController.DeleteOldOnes);

//Update weather to the db
app.get('/weather', weatherController.update);

//1.Create Mongoose model from event Schema
//2.Create Graphql schema for events, weather
//3. Model the reserved event.
//4. HSL 
app.use('/graphql', (req, res) => {
    graphqlHTTP({schema: rootSchema, graphiql: true, context: {req, res}})(req,
        res);
  });
  



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
