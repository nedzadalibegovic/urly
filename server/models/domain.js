const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema(
    {
        domain: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('Domain', domainSchema);
