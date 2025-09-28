const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    addresses: [
        {
            address: { type: String, required: true },
            city:    { type: String, required: true },
            pincode: { type: String, required: true },
            phone:   { type: String, required: true },
            notes:   { type: String }
        }
    ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;