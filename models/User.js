const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    contact_person:{
      type:String,
    },
    title:{
      type:String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      //   required: [true, "Please enter an email"],
      //   unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      // required: [true, "Please enter a password"],
      // minlength: [6, "Password must be at least 6 characters"],
      //select: false,
    },
    mob_no: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
    },
    gender:{
      type: String,
    },
    profile_type: {
      type: String,
    },
    images:{
      type:String,
      default:"https://great-perlman.89-163-227-50.plesk.page/uploads/profile.png"
    },
    cimages:{
      type:String,
      default:""
    },
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
    //   },
    // ],
    
    // cimages: [
    //   {
    //     public_id: {
    //       type: String,
    //       // required: true,
    //     },
    //     url: {
    //       type: String,
    //       // required: true
    //     },
    //   },
    // ],
    address: {
      type: String,
      default :"",
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    about_us:{
      type:String,
      default:""
    },
    status: {
      type: String,
      default: "online",
    },
    ActiveStatus: {
      type: String,
      default: "Activate",
    },
    AccountType: {
      type: String,
      default: "Personal",
    },
    Rating:{
      type: Number,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    story: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    category:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        ///unique:true
      }],
    subcategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        //unique:true
      },
    ],
    createdAt: {
      type: Date,
      default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
    },
    updatedAt: {
      type: Date,
      default: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

// userSchema.pre("save",async function(next){
//     if(this.isModified("password")){
//         this.password = await bcrypt.hash(this.password,10);
//     }
//     next();
// });

// userSchema.methods.matchPassword = async function(password){
//     return await bcrypt.compare(password, this.password);
// }

// userSchema.methods.generateToken = function(){
//     return jwt.sign({
//       _id:this._id,
//       name:this.name,
//       email:this.email
//     },process.env.JWT_SECRET,{ expiresIn:'2d'})
// };

// userSchema.methods.getResetPasswordToken = function(){
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     this.resetPasswordToken = crypto.createHash("sha256")
//                                     .update(resetToken)
//                                     .digest("hex");

//     this.resetPasswordExpire = Date.now() * 10*60*1000;

//     return resetToken;
// }

