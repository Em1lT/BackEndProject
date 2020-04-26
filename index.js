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

<<<<<<< HEAD
=======
//1.Create Mongoose model from event Schema
//2.Create Graphql schema for events, weather
//3. Model the reserved event.
//4. HSL 

>>>>>>> origin/dev-tim
app.use('/graphql', (req, res) => {
    graphqlHTTP({schema: rootSchema, graphiql: true, context: {req, res}})(req,
        res);
  });
<<<<<<< HEAD
  
app.listen(port, () => console.log(`App has started and is running on port:  ${port}!`))
=======


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
>>>>>>> origin/dev-tim
