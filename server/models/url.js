const mongoose = require('mongoose');
const got = require('got');

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
                validator: async (str) => {
                    try {
                        const { statusCode } = await got(str);
                        return statusCode < 400;
                    } catch (err) {
                        return false;
                    }
                },
                message: (str) => `${str.value} is not a valid URL`,
            },
            unique: true,
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
