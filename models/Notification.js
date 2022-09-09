const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    message:{
        type:String,
    },
    type:{
        type:String,
    },
    status:{
        type:String,
        default:"unseen"
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
      },
    updatedAt: {
        type: Date,
        default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
      },
},
{
    timestamps:true,
}
)


module.exports = mongoose.model("Notification",notificationSchema);

