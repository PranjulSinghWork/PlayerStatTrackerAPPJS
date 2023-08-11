const mongoose = require('mongoose');

const schemaDefinitionObj = {
    name: {
        type: String,
        required: true
    }
};

const teamSchema = new mongoose.Schema(schemaDefinitionObj)

module.exports = mongoose.model('Team', teamSchema)