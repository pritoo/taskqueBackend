const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const req = require('express/lib/request');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


// User Registration Controller
// exports.RegisterUser = async (req, res) => {
//     const { first_name, last_name, user_name, email, password1, conf_password, phone } = req.body;

//     // if (!email || !password) {
//     //     return res.status(400).json({ error: "Please fill all the fields" });
//     // }

//     //   function apiResponse(results){
//     //     return JSON.stringify({"status": 200, "error": null, "response": results});
//     // }

//     try {
//         // const UserExist = await User.findOne({ _id:"62822cf73d664fa86a9a586a"})
//         // console.log(UserExist)
//         // res.send({data:UserExist})
//         // if (UserExist) {
//         //     return res.status(400).json({ error: "userdetail already exists" })
//         // }
//         const NewUser = new User({ first_name, last_name, user_name, email, password1, conf_password, phone })
//         const imageName = req.file.originalname;
//         NewUser.imageName = imageName
//         console.log(NewUser.imageName)
//         await NewUser.save();
//         console.log("UserRegister", NewUser)

//         res.status(200).json({ message: "User Registered Successfully" });

//     } catch (error) {
//         console.log(error);
//     }
// };


exports.profileUser = async (req, res) => {
    const { id } = req.params;
    try {
        const UserExist = await User.findOne({ _id: mongoose.Types.ObjectId });

        return res.status(200).json(UserExist);
    } catch (error) {
        return res.status(200).json({ message: error.message });
    }
};

// User Login Controller
exports.UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please enter Email and Password" });
        }

        const userLogin = await User.findOne({ email: email});
        console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            //const isMatch = await (password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            console.log(token);
            userLogin.token = token;
            await userLogin.save();

            const ip_address = requestIp.getClientIp(req);
            console.log(ip_address);
            userLogin.ip_address = ip_address;
            await userLogin.save();

            const user_agent = ({
                "browser": req.useragent.browser,
                "version": req.useragent.version,
                "os": req.useragent.os,
                "platform": req.useragent.platform,
                "source": req.useragent.source
            });
            console.log(user_agent);
            userLogin.user_agent = user_agent;
            await userLogin.save();

            const created = new Date();
            console.log(created);
            userLogin.created = created;
            await userLogin.save();

            // res.cookie("jwt_cookie", token, {
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true
            // });

            if (isMatch) {
                res.status(200).json({ 'statusCode': '200', 'data': userLogin, token: token });
                // req.session.userId = req.params.id;
                // console.log(req.session.userId);
            } else {
                res.status(400).json({ error: "Invalid Password" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error);
    }
};


// All Users list Controller
exports.GetUser = async (req, res, next) => {
    try {
        console.log(req.params)
        const UserData = await User.findOne({ _id: req.params.id });
        res.status(200).json({ 'statusCode': '200', 'data': UserData });
        //console.log(UserData);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.EditUserProfile = async (req, res) => {

    try {
        //const { first_name,last_name,user_name,email,password1,conf_password,phone } = req.body;
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            user_name: req.body.user_name,
            password1: req.body.password1,
            conf_password: req.body.conf_password,
            phone: req.body.phone,
            imageName: req.file.originalname
        }
        console.log("hello",user)
        
        const data = await User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true })
        
        if (data) {
            await data.save();
            res.status(200).json(user);
        }
    } catch (err) {
        console.log(err)
    }

}

// exports.UserId = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         let hours = 0;
//         if (user.attendance.length > 0) {
//             user.attendance.reverse();
//             user.attendance.map(a => {
//                 if (a.checkin && a.checkout.time) {
//                     hours = hours + calculateHours(a.checkin.getTime(), a.checkout.time.getTime());
//                 }

//             })
//             hours = parseFloat(hours / (3600 * 1000)).toFixed(4);
//         }

//         console.log(user);
//         console.log(hours);
//         res.status(200).json(user)
//     } catch (error) {
//         console.log(error);
//         res.status(400).json(error)
//     }
// }

//check in
exports.Checkin = async (req, res) => {
    try {
        const userCheckin = await User.findById(req.params.id);
        const newDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const checkin = ({
            "date": newDate.getDate() + '-' + (newDate.getMonth()+1) + '-' + newDate.getFullYear(),
            "time": newDate.getHours() + ':' + newDate.getMinutes(),
            "datetime": "Today's check in time: " + newDate.getDate() + ' ' + (monthNames[newDate.getMonth()]) + ' ' + newDate.getFullYear() + " at " + newDate.getHours() + ':' + newDate.getMinutes()
        })
        console.log(checkin);
        userCheckin.checkin = checkin;
        await userCheckin.save();
        res.status(200).json({"time": checkin});
    } catch (error) {
        console.log("something went wrong");
        res.status(400).json({ error: "error" })
    }
}

//check out
// exports.GetCheckout = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findOne({ _id: id });
//         res.status(200).json({ message: "checkout Successful" })
//     } catch (error) {
//         console.log('Cannot find User');
//         res.status(400).json({ error: "error" })
//     }

// }

exports.Checkout = async (req, res) => {
    try {
        const userCheckout = await User.findById(req.params.id);
        const newDate = new Date();
        const checkout = ({
            "date": newDate.getDate() + '-' + newDate.getMonth() + '-' + newDate.getFullYear(),
            "time": newDate.getHours() + ':' + newDate.getMinutes()
        })
        userCheckout.checkout = checkout;
        await userCheckout.save();
        res.status(200).json({"time": checkout}); 
    } catch (error) {
        console.log('Cannot find User');
        res.status(400).json({ error: "error" })
    }
}


// function calculateHours(entryTime, exitTime) {
//     let time = 0;
//     time = time + (exitTime - entryTime);
//     return time;
// }

exports.VerifyToken = async (req, res) => {
    const { token } = req.params;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const detail = await User.findById(data._id);
    res.status(200).json({ message: "user detail", detail });
    console.log(detail);

}

// exports.getIP = async (req,res) => {
//     try {
//         const clientIP = requestIp.getClientIp(req);
//         console.log(clientIP);
//         res.status(200).json({"IP": clientIP});
//     } catch (error) {
//         res.status(400).json({error: "error"});
//     }
// }
