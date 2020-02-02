const mongoose = require('mongoose');

let urlSchema = new mongoose.Schema({
    title: String,
    date: { type: Date, default: Date.now },
    url: String,
    code: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Url', urlSchema);