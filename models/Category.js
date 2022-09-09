const mongoose = require("mongoose");


// New Schema
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        // uppercase: true,
    },
    image:{
        type:String,
    },
    subcategory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
    }],
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
});


const subcategorySchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    name:{
        type:String,
        // uppercase: true,
    },
    image:{
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
});

const cat= mongoose.model("Category",categorySchema);
const subcat= mongoose.model("Subcategory",subcategorySchema);

module.exports = {
    Category:cat, 
    Subcategory:subcat,
}