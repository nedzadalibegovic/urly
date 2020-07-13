const mongoose = require('mongoose');
const urlExist = require('url-exist');

let urlSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            maxlength: 32,
            required: true,
        },
        url: {
            type: String,
            required: true,
            validate: {
                validator: (str) => urlExist(str),
                message: (str) => `${str.value} is not a valid URL`,
            },
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('URL', urlSchema);
