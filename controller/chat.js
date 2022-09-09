var Chat = require("../models/Chat");
var User = require("../models/User");
const jwt_decode = require("jwt-decode");
var ObjectId = require('mongodb').ObjectId;


async function SendMessage(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        //  console.log(data);

        const todayDate = getFormattedDate();
        const today = new Date();

        // Correct Time
        //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
        console.log(new Date().toLocaleString());
        console.log(new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString());
        
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        
        const {message} = req.body;

        const user = await User.findById(req.params.id);

        if(!user){
            var response = {
                status: 201,
                message: "Receiver User Not Found",
              };
            return res.status(201).send(response);
        }
        
        if(user_id === user.id){
            var response = {
                status: 201,
                message: "U can't Send Message to Urself",
              };
            return res.status(201).send(response);
        }
        
        const datas = {
            sender : user_id,
            receiver : user._id,
            message : message,
            time : time,
            date : todayDate,
        }
              const chat = await Chat(datas);
        await chat.save()
        .then(() => {
            var response = {
                status: 200,
                message: "Message send Successfully",
                data: chat,
            };
            return res.status(200).send(response);
            })
        .catch(error => {
            var response = {
                status: 201,
                error: error,
                message: "Message sending Error",
            };
            return res.status(200).send(response);
        })
    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }

}


async function GetAllChat(req,res){
        try{

        const chat = await Chat.find(req.query).populate({path:"sender",select: ['username', 'email']})
                                               .populate({path:"receiver",select: ['username', 'email']})
                                               .sort({createdAt: -1})
        if(chat){
            var response = {
                status: 200,
                message: 'successfull',
                data: chat,
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Chat Found",
              };
            return res.status(201).send(response);
        }
} catch (error) {
    var response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function GetConversation(req,res){
    try{
        //const chat = await Chat.find(req.query).populate({path:"sender",select: ['username', 'email']})
        //                                      .populate({path:"receiver",select: ['username', 'email']})
        
        //const {sender,receiver}= req.body;
        const {sender,receiver}= req.query;

        const chat = await Chat.aggregate([
                            {$match:{
                                $or:[
                                    {'sender':ObjectId(sender), 'receiver':ObjectId(receiver)},
                                    {'receiver':ObjectId(sender), 'sender':ObjectId(receiver)}
                                ]
                                }
                                }])
                            .sort({createdAt: -1})
            
        if(chat){
            chat.forEach((data)=>{
                // console.log(data.message);
                // console.log(data.type);
                data.type = "seen"
            })
            var response = {
                status: 200,
                message: 'successfull',
                data: chat,
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Conversastion Found",
              };
            return res.status(201).send(response);
        }

   
} catch (error) {
    var response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function GetHistory(req,res){
    try{
        const cht = [];
        const users = [];
        const lastm = [];

        const chat = await Chat.find({}).populate({path:"sender",select: ['username', 'email']})
                                        .populate({path:"receiver",select: ['username', 'email']})
                                        .sort({createdAt: -1})
                                        //.distinct("sender")
                                        .exec()
        //console.log(chat.length);
        res.send(chat);
        // for(var a=0;a<chat.length;a++){
        //     //console.log("a",a);
        //     let counts = 0;
        //     //console.log(chat[a].receiver[0]);
        //     if(cht.length>0){
        //         for(var j=0;j<cht.length;j++){
        //             // console.log("j",j);
        //             // console.log(cht[j]);
        //             // console.log(chat[a].receiver[0]);
        //             if(chat[a].receiver[0].toString() != cht[j].toString()){
        //                 // console.log("not match");
                        
        //                 counts = 1
        //             } else{
        //                 console.log(chat[a].message);
        //                 counts = 0;
        //                 break;
        //             }
        //         }
        //         // console.log("counts",counts);
        //         if(counts){
        //             cht.push(chat[a].receiver[0])
        //             // console.log("data",cht);
        //         }
        //     // console.log("length",cht.length);
        //     } else {
        //         cht.push(chat[a].receiver[0])
        //         // console.log("hello",cht);
        //     }
        // }

        // let count = 0;
        // if(cht.length>0){
        //     cht.forEach(async(data)=>{
        //         const user = await User.findById(data);
        //         users.push(user)
        //         count++;
        //         if(count == cht.length){
        //             var response = {
        //                 status: 200,
        //                 message: 'successfull',
        //                 data: users,
        //               };
        //             return res.status(200).send(response);
        //         }
        //     })
        // }
        // else{
        //     var response = {
        //         status: 201,
        //         message: "No Conversation Found",
        //       };
        //     return res.status(201).send(response);
        // }

    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function DeleteMessage(req,res){
    try{

        const chat = await Chat.findById(req.params.id)
        
        if(chat){
            //await Post.remove()
            Chat.findByIdAndDelete(req.params.id,(err, docs)=> {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                    messages: "Message delete failed",
                  };
                  return res.status(201).send(response);
                } else {
                    var response = {
                        status: 200,
                        message:"Message removed successfully",
                        data:docs,
                    };
                  return res.status(200).send(response);
                }
              });
        } else{
            var response = {
                status: 201,
                message: "No Message Found",
              };
            return res.status(201).send(response);
        }

    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function GetHistorymsg(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;

        const user = await User.findById(user_id)

        if(!user){
            var response = {
                status: 201,
                message: "No User Found  plz Login First",
              };
            return res.status(201).send(response);
        }

        let datas = await Chat.aggregate([{$match:{
                                                $or:[
                                                    {'sender':user._id},
                                                    {'receiver':user._id},
                                                ]}}]);
        datas = datas.reverse();

        if(datas){

        await User.populate(datas,{path: "sender receiver",select: ['name','username', 'email','images']})

        let arr = [];
        let count = 0;
        let send = [];
        let rec = [];
        const len = datas.length;

        console.log(datas);
        datas.forEach((dataz)=>{

            if(dataz.sender[0]._id.toString() == user._id.toString())
            {
                if(!rec.includes(dataz.receiver[0]._id.toString()))
                {
                    if(!send.includes(dataz.receiver[0]._id.toString()))
                    {
                        rec.push(dataz.receiver[0]._id.toString());
                        console.log(dataz.receiver[0]);
                        const datazz = {
                            message : dataz.message,
                            user_id:dataz.receiver[0]._id,
                            name:dataz.receiver[0].name,
                            username:dataz.receiver[0].username,
                            email:dataz.receiver[0].email,
                            images:dataz.receiver[0].images,
                            type: dataz.type,
                            time: dataz.time,
                            date:dataz.date
                        }
                        arr.push(datazz);
                    }
                }
            }

            if(dataz.receiver[0]._id.toString() == user._id.toString())
            {
                if(!send.includes(dataz.sender[0]._id.toString()))
                {
                    if(!rec.includes(dataz.sender[0]._id.toString()))
                    {
                        send.push(dataz.sender[0]._id.toString())
                        const datazz = {
                            message : dataz.message,
                            user_id:dataz.sender[0]._id,
                            name:dataz.sender[0].name,
                            username:dataz.sender[0].username,
                            email:dataz.sender[0].email,
                            images:dataz.sender[0].images,
                            type: dataz.type,
                            time: dataz.time,
                            date:dataz.date
                        }
                        arr.push(datazz);
                    }
                }
            }


            count=count+1;
            if(count===len){
                var response = {
                    status: 200,
                    message: 'successfull',
                    data: arr,
                  };
                  return res.status(200).send(response);
            }
        })
        } else {
            var response = {
                status: 201,
                message: "No Chat Found",
              };
            return res.status(201).send(response);
        }
    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


module.exports = {
    SendMessage,
    GetAllChat,
    GetConversation,
    GetHistory,
    DeleteMessage,
    GetHistorymsg,
}


function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
}