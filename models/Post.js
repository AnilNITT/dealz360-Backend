const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        // required: true,
    },
    images:[
        {
            type:String,
        }
    ],
    // images: [
    //     {
    //       public_id: {
    //         type: String,
    //         required: true,
    //       },
    //       url: {
    //         type: String,
    //         required: true,
    //       },
    //     },
    //   ],
    caption:{
        type:String,
    },
    header:{
        type:String,
    },
    online_available:{
        type:String,
    },
    brand:{
        type:String,
    },
    subcategory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
    }],
    // Multer
    // filename:{
    //     type : String,
    //     //unique : true,
    // },
    // contentType:{
    //     type : String,
    // },
    // imageBase64 : {
    //     type : String,
    //     //required: true
    // },
    type:{
        type:String,
    },
    like_count:{
        type:String,
    },
    comment_icon:{
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
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        comment:{
            type:String,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        createdAt: {
            type: Date,
            default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
        },
    }],
},
{
    timestamps:true,
}
)


module.exports = mongoose.model("Post",postSchema);

