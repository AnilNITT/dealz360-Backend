var express = require("express");
var app = express();
const mongoose = require("mongoose")
var path = require('path');
var http = require('http');
var bodyParser = require("body-parser");
var apiRouter = require("./routes/index");
var cookieParser = require("cookie-parser");
require("dotenv").config();
//var formidable= require('./middleware/formidable');
//const fileUpload = require("express-fileupload");
// var cloudinary = require("cloudinary")
// Create Server
var server = http.createServer(app);
var multer = require('multer');
// var cors = require("cors")
const morgan = require("morgan");


app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET,PATCH, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,application/json,application/x-www-form-urlencoded, Accept, multipart/form-data");
  next();
});

// parse requests of content-type - application/json
// app.use(cors())
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static('public'));
//app.use(fileUpload())
//app.use(formidable());
// parse requests of content-type - application/x-www-form-urlencoded


app.get("/",(req,res)=>{
  res.status(200).json({message:"Dealz360 API Working"})
})

app.use("/dealz360", apiRouter);
//app.use('/profile', express.static('upload/images'));
app.use('/uploads', express.static('uploads'));



const DB_URL = "mongodb+srv://test:test@cluster0.jh3sk0l.mongodb.net/?retryWrites=true&w=majority"
// const DB_URL = "mongodb://192.168.0.106:27017/dealz360";
// const DB_URL = "mongodb://localhost:27017/dealz360";

// const DB_URL = process.env.MONGO_URI

mongoose
  .connect(DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
  .then((data) => {
    console.log(`Mongodb connected with : ${data.connection.host} server`);
  })
  .catch((err) => {
    console.log("mongodb error", err);
  });


const port = process.env.PORT || 5000;
server.listen(port , ()=>{
    console.log(`Server is working on Port : ${port}`)
})


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME || "dsf06urnv",
//   api_key: process.env.CLOUDINARY_API_KEY || "977216532728125",
//   api_secret: process.env.CLOUDINARY_API_SECRET || "OayhskPJzuM-C8mWy9hUVWirawQ",
//   secure:true,
// });


function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
      res.json({
          success: 0,
          message: err.message
      })
  }
}
app.use(errHandler);





