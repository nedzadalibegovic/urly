const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        max: 20
    },
    password: {
        type: String,
        required: true,
        min: 8,
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);