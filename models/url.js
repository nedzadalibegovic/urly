const mongoose = require('mongoose');
const urlExist = require('url-exist');

let urlSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: str => urlExist(str),
            message: str => `${str.value} is not a valid URL`
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('URL', urlSchema);