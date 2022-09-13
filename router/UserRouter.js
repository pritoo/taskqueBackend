const express = require('express');
const User = require('../models/UserSchema');
const router = express.Router();
const UserAuth= require('../middleware/UserAuthentication');
const { RegisterUser, UserLogin, GetUser,EditUserProfile, UserId, Checkin, GetCheckout, Checkout, VerifyToken } = require('../controller/UserController');
//const { UserProfile } = require('../controller/UserProfileController');
const multer = require('multer');
const { AddLeaveBalance ,leaveBalance,updateLeaveBalance,applyLeaveBalance} = require('../controller/LeaveController');
const useragent = require('express-useragent');

router.use(useragent.express());

// User Registration Router
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'image');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + '-' + file.originalname);
    }
 });
 var upload = multer({ storage: storage });
// router.post('/register', upload.single('imageName'), RegisterUser);

// User Login Router
router.post('/login', UserLogin);

// All Users List Router with Middleware
router.get('/getuserdata/:id', GetUser, (req,res) => {
    res.send(req.user);
});

router.put('/EditUserProfile/:id',upload.single('imageName'),EditUserProfile)

// router.get('/user/:id', UserId);

router.post('/user/:id/checkin', Checkin);

// router.get('/user/:id/checkout', GetCheckout);

router.post('/user/:id/checkout', Checkout);

router.get('/getuserdetail/:token', VerifyToken);

router.get('/addleavebalance/:user_code',AddLeaveBalance);

router.put('/updateLeaveBalance',updateLeaveBalance);

router.post('/applyLeaveBalance', applyLeaveBalance);

//router.get('/leaveBalance',leaveBalance);



module.exports = router;

