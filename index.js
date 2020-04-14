require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001
const graphqlHTTP = require('express-graphql');
const rootSchema = require('./schema/rootSchema');
const helsinkiApiController = require('./Controllers/helsinkiApiController');
const weatherController = require('./Controllers/weatherController');
const hslApiController = require('./Controllers/hslController');

const db = require('./service/db');

//helsinkiApiController
app.get('/update', helsinkiApiController.update);
app.get('/delete', helsinkiApiController.DeleteOldOnes);

//Update weather to the db
app.get('/weather', weatherController.update);

//1.Create Mongoose model from event Schema
//2.Create Graphql schema for events, weather
//3. Model the reserved event.
//4. HSL 
app.use(
    '/graphql',
    graphqlHTTP({
        schema: rootSchema,
        graphiql: true,
    }),
);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
