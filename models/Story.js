const mongoose = require('mongoose');


const StorySchema = new mongoose.Schema({
    caption: {
      type: String,
      default: '',
    },
    images:[
      {
        name: String,
        time: {
          type: Date,
          default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
        },
      }
    ],
    // images: [
    //   {
    //     public_id: {
    //       type: String,
    //       required: true,
    //     },
    //     url: {
    //       type: String,
    //       required: true,
    //     },
    //     time: {
    //       type: Date,
    //       default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
    //     },
    //   },
    // ],
    type:{
      type: String,
      default: 'story',
    },
    storytype:{
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
    },
    updatedAt: {
      type: Date,
      default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
    },
    seen_by:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    }]
},
{
  timestamps:true,
}
);

module.exports = mongoose.model("Story",StorySchema);
