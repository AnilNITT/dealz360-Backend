const Notification = require("../models/Notification");


async function GetAllNotification (req,res){
    try{

        const notification = await Notification.find(req.query).populate({path:"user",select: ['email','username','name','images']})
                                                               .populate({path:"owner",select: ['email','name','username','images']})
                                                               .populate({path:"post_id",select: ['user','images','type']})
                                                               .sort({createdAt: -1})
        
        if(notification){
            var response = {
                status: 200,
                data: notification,
                message: 'successfull',
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Notification Found",
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
    GetAllNotification,
}