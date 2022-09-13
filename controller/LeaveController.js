const Leave = require("../models/UserPriviledgeLeavesSchema");
const UserLeaves = require("../models/ApplyLeaveSchema");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const User = require("../models/UserSchema");
const cron =require("node-cron")

exports.AddLeaveBalance = async (req, res) => {
  try {
    const { user_code } = req.body;
    const users = await User.find();
    //console.log("hello", users);

    if (users.length > 0) {
      for(let i=0; i < users.length; i++){
        //console.log("usercode",users[i].user_code)
       const sort = { user_code: -1 };
        const leaveData = await Leave.find({"user_code":(users[i].user_code),sort})
        
          console.log("leave",leaveData)
         //await leaveData.forEach(console.dir);
       //res.status(200).json({ 'statusCode': '200', 'data': leaveData });
       
      }
    }
   } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.updateLeaveBalance = async (req,res)=>{
  const user_code = req.body.user_code;
  console.log(user_code)
  
 try {
   const leaves = await Leave.find().updateMany(
    { },
        [
         {$set: { "opening_leave": "$closing_leave"}}, 
        ],
      )
     const leaveinc = await Leave.find().update(
     { $inc :{closing_leave :1.5} }
     )
       console.log("update data",leaveinc);
      return  res.status(200).json({ 'statusCode': '200', 'data': leaveinc });
 }
   catch (error) {
    return  res.status(400).json(error);
 }
};

exports.applyLeaveBalance = async (req,res,next)=>{
 
  try {
    
    const {user_code,reason,mode_of_half_day,mode_of_day,from_date,to_date}= req.body;
    console.log(user_code)
    if(!user_code){
      return res.status(400).json( 400, "user_code not found" )
    }
    //console.log(user_code,"applyleave")
      const leaverequest = await User.findOne({user_code: user_code})
      //console.log(leaverequest,"leaverequest")
      if(user_code){
        const createLeaveRequest = await UserLeaves.findOne({user_code:user_code});
        console.log(createLeaveRequest,"leave request test")
        await createLeaveRequest.save();
      }
    // else{
    //   const createLeaveRequest = await new UserLeaves(leaverequest);
    //   await createLeaveRequest.save();
    // }
    
  } catch (e) {
    return next(e);
  }


}




 // var response = {};
  // const user_code = req.body.user_code;
  // var leaves;
  // if(user_code!=null && user_code!=""){
    
  //   leaves = await Leave.find(
  //     { user_code: user_code }
  //   );
  // } else {
  //   leaves = await Leave.find();
  // }

  // var key = 0;
  // function userCodeLoop( key ) {

  //   if( leaves.length > key ) {

  //     key++;
  //     userCodeLoop( key );

  //   } else {
  //     response['authCode'] = true;
  //     response['message'] = "success";
  //     response['count'] = leaves.length;
  //     res.send(response);
  //   }
    
  // }
  // userCodeLoop( key );




