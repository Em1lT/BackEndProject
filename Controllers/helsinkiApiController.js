'use strict';
const helApi = require('../service/helsinkiApi');
const helsinkiModel = require('../model/helsinkiModel');

const update = async (req, res) => {

    let data = await helApi.getAll()
    let updated = await searchAndUpdate(data);
    //console.log("response");
    res.json(data[0]);
}

const getAll = async (limit) => {
    //Find events that start 2 weeks into the future -> this because we will only also to show them weather included
    let data = await helsinkiModel.find({"event_dates.starting_day":{ 
        $lte: new Date(new Date().getTime() + 16 * 60 * 60 * 24 * 1000).toISOString()}
    }).limit(limit ? limit : 10);
    return data;
}

const searchAndUpdate = async (data) => {
    data.map(async (item) => {
        let dbData = await helsinkiModel.findOne({
            id: item.id
        })

        if (!dbData) {
            let eventModel = createModel(item);
            eventModel.save();
        }
        //TODO: if data is changed -> update
    })
}

const createModel = (item) => {
    let eventModel = new helsinkiModel(item)
    return eventModel;
}

const DeleteOldOnes = async () => {
    let data = await helsinkiModel.find({});
    data.map(async (event) => {
        let ts = Date.now();
        if (!event.event_dates.starting_day) {
            await helsinkiModel.deleteOne({
                id: event.id
            })
        } else if (event.event_dates.starting_day.getTime() < ts) {
            await helsinkiModel.deleteOne({
                id: event.id
            })
        }
    })
}

module.exports = {
    update,
    DeleteOldOnes,
    getAll
}