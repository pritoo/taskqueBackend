const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const router = require('./router/UserRouter');
const cron =require("node-cron");
var request = require("request");
//const uuid = require("uuid");
var site_api_url = "http://localhost:5000";

dotenv.config({ path: './config.env' });
require('./DataBase/DB_Connection');


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(router);


const task = cron.schedule('0 0 1 jan,feb,mar,apr,may,june,jul,aug,sep,oct,nov,dec *', () =>  {
   console.log('stopped task');
           
        var api_url = site_api_url+'/updateLeaveBalance';
            console.log(api_url);
            request({
                url: api_url,
                method: "PUT",
                json: true,   // <--Very important!!!
                body: {}
            }, function (error, response, body){
                console.log(body);
            });
            
        //scheduled: false   
        //task.stop() 
  });
  //task.start();
  
//app.use(uuid);

// app.use(session({
//     secret: 'somesecret',
//     resave: false,
//     saveUninitialized: true,
// }));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})

