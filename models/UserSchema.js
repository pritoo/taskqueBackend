const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const UserSchema = new mongoose.Schema({
    // tl_id: {
    //     type: Number,
    //     default: null
    // },
    user_code: {
        type: Number,
        default: null
    },
    first_name: {
        type: String,
        required: true,
        $ne: null
    },
    last_name: {
        type: String,
        required: true,
        $ne: null
    },
    user_name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        $ne: null,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is Invalid");
            }
        }
    },
    // imageName: {
    //     type: String,
    //     default: null
    // },
    password: {
        type: String,
        required: true,
        $ne: null
    },
    // conf_password: {
    //     type: String,
    //     required: true,
    //     $ne: null
    // },
    // secret_key: {
    //     type: String,
    //     default: null
    // },
    // api_key: {
    //     type: String,
    //     default: null
    // },
    phone: {
        type: String,
        default: null
    },
    // dob: {
    //     type: Date,
    //     default: null
    // },
    // doj: {
    //     type: Date,
    //     default: null
    // },
    // hbd_page_seen: {
    //     type: String,
    //     enum: ['yes','no'],
    //     default: 'no'
    // },
    // account_type: {
    //     type: String,
    //     enum: ['Client','WeDigTech'],
    //     $ne: null,
    //     default: 'WeDigTech'
    // },
    // position_id: {
    //     type: Number,
    //     $ne: null
    // },
    designation: {
        type: String,
        enum: ['management','tech_lead','team'],
        default: 'team'
    },
    // status: {
    //     type: Number,
    //     $ne: null,
    //     default: 1
    // },
    // last_login: {
    //     type: Date,
    //     default: null
    // },
    // last_login_ip: {
    //     type: String,
    //     default: null
    // },
    // deactivate_date: {
    //     type: Date,
    //     default: null
    // },
    // created: {
    //     type: Date,
    //     default: null
    // },
    // modified: {
    //     type: Date,
    //     default: null
    // },
    // attendance: [{
    //     date: {
    //         type: Date,
    //         default: Date.now,
    //     },
    //     checkin: { type: Date },
    //     checkout: {
    //         time: {
    //             type: Date
    //         }
    //     }
    // }],

    checkin: {
        date: {type: String},
        time: {type: String},
        datetime: {type: String}
    },
    checkout: {
        date: {type: String},
        time: {type: String}
    },
    ip_address: {
        type: String,
        default: null,
    },
    session_id: {
        type: String,
        default: null
    },
    user_agent: [{
        browser: {type: String},
        version: {type: String},
        os: {type: String},
        platform: {type: String},
        source: {type: String}
    }],
    created: {
        type: Date,
        default: null
    },
    token: {
        type: String,
        default: ''
    }
})

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Generating Authentication Token
UserSchema.methods.generateAuthToken = async function () {
    try {
        const User = this
        const token = jwt.sign({ _id: User._id }, process.env.SECRET_KEY);
        User.token = token;
        await User.save();
        return token;
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

const User = new mongoose.model('users', UserSchema);

module.exports = User;