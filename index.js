require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const helApi = require('./service/helsinkiApi');
const graphqlHTTP = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');
const db = require('./service/db');


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/update', async (req, res) => {
    let data = await helApi.getAll()
    let response = await db.insertMany(data);
    console.log("response");
    res.json(data);
});

app.get('/test', async (req, res) => {

    let response = await db.getAll();
    res.json(response);
});


app.use(
    '/graphql',
    graphqlHTTP({
        schema: MyGraphQLSchema,
        graphiql: true,
    }),
);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
