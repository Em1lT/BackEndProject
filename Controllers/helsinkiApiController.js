'use strict';
const helApi = require('../service/helsinkiApi');
const helsinkiModel = require('../model/helsinkiModel');

const update = async (req, res) => {

    let data = await helApi.getAll()
    let updated = await searchAndUpdate(data);
    //console.log("response");
    res.json(data[0]);
}

const getAll = async (limit, today, nameIncludes) => {

    if(today && today === true) {
        let data = await helsinkiModel.find({"event_dates.starting_day":{ 
            $lte: new Date(new Date().getTime() + 7 * 60 * 60 * 24 * 1000).toISOString(),
            $gte: new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000).toISOString()
            
        }
        }).limit(3);
        return data;
    }

    if(nameIncludes) {
        let data = await helsinkiModel.find( {$and: [{"event_dates.starting_day":{ 
            $lte: new Date(new Date().getTime() + 16 * 60 * 60 * 24 * 1000).toISOString(),
        }},{"name.fi":{
            $regex: nameIncludes 
        }}
    ]}).limit(20);
        return data;    
    }

    //Find events that start 2 weeks into the future -> this because we will only also to show them weather included
    let data = await helsinkiModel.find({"event_dates.starting_day":{ 
        $lte: new Date(new Date().getTime() + 16 * 60 * 60 * 24 * 1000).toISOString()}
    }).limit(limit ? limit : 10);
    return data;
}

const getOne = async (name) => {
    //getOne from the database with the id
    let data = await helsinkiModel.find({"id": name});
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

const DeleteOldOnes = async (req,res) => {
    let data = await helsinkiModel.find({});
    let deletedID = 0;

    //TEST this one
    await data.map(async (event) => {
        console.log(event);
        let ts = new Date(new Date().getTime() * 1000).getTime()
        console.log(event.event_dates.starting_day.getTime() +"<<<<"+ ts)
        if (!event.event_dates.starting_day) {
            deletedID++;
            await helsinkiModel.deleteOne({
                id: event.id
            })
        } else if (event.event_dates.starting_day.getTime() < ts && event.event_dates.ending_day.getTime() < ts) {
            deletedID++;            
            await helsinkiModel.deleteOne({
                id: event.id
            })
        }
    })
    res.json("Number of deleted items:"+ deletedID)
}

module.exports = {
    update,
    DeleteOldOnes,
    getAll,
    getOne
}