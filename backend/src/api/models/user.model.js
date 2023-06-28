const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    birthdate: {
        type: Date,
        required: false
    },
    role: {
        type: Array,
        default: ['user'],
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);