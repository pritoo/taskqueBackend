const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const UserPriviledgeLeavesSchema = new mongoose.Schema({
    user_code: {
        type: Number,
        default: null
    },

    opening_leave: {
        type: Number,
        default: null
    },

    casual_leave: {
        type: Number,
        default: null
    },

    holiday: {
        type: Number,
        default: null
    },

    extra_working: {
        type: Number,
        default: null
    },

    half_day: {
        type: Number,
        default: null
    },

    salary_deduct: {
        type: Number,
        default: null
    },

    closing_leave: {
        type: Number,
        default: null  
    },

    date: {
        type: Date,
        default: null
    },

    user_id: {
        type: Number,
        default: null
    },

})


const Leave = new mongoose.model('user_privilege_leaves', UserPriviledgeLeavesSchema);

module.exports = Leave;