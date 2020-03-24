const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const helsinkiSchema = new Schema({
    data: Object
})

const Event = mongoose.model(process.env.DB_COLLECTION, helsinkiSchema);

const insertOne = () => {}

const insertMany = async (data) => {

    data.forEach(item => {

        const event = new Event({
            data: item
        });
        //Check if here if event exists or not
        event.save().then(() => console.log('inserted new event'));
    })
}

const getSome = (limit) => {
    //Should return the limit
    return Event.find((err, events) => {

        if (limit > events.length) {
        }

        let arr = [];

        for (let i = 0; i < limit; i++) {
            console.log(events[i].data.id)
            arr.push(events[i])
        }
        return arr
    })
}


const getAll = () => {

    return Event.find((err, events) => {
        return events[0]
    })
}

module.exports = {
    insertOne,
    insertMany,
    getAll,
    getSome
}