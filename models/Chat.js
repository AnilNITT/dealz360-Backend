const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    message:{
        type:String,
    },
    sender:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    receiver:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    type:{
        type:String,
        default:"unseen"
    },
    time:{
        type:String,
    },
    date:{
        type:String,
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
})

module.exports  = mongoose.model('Chat', ChatSchema);