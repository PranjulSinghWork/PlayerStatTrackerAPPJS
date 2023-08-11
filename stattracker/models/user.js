const mongoose = require('mongoose');
const passportLocal = require("passport-local-mongoose")
const schemaDefinitionObj = {
    username: String,
    password: String,
    oauthId: {type: String},
    oauthProvider: {type: String},
    created: {type: Date}
}

const mongooseSchema = new mongoose.Schema(schemaDefinitionObj);
mongooseSchema.plugin(passportLocal);
module.exports = new mongoose.model('User', mongooseSchema);    