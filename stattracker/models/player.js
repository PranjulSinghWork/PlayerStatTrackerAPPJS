//Providing the object definition for players router for the db
//Importing modules

const mongoose = require('mongoose');

//creating schema object
//the following code is taken and modified from class lesson
const schemaDefinitionObj = {
    name: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    pointPGame: {
        type: String,
        required: true
    },
    team: {
        type: String,
        requried: true
    },
    imageUrl: {
        type: String,
       default: 'default.png' 
    }
}

//creating the mongoose obj
const mongooseScehma = new mongoose.Schema(schemaDefinitionObj);

module.exports = mongoose.model("Player", mongooseScehma)