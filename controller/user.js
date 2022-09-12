var User = require("../models/User");
var validation = require("../helper/validation");
const jwt_decode = require("jwt-decode");
// var bcrypt = require("bcryptjs");
var Sendemail = require("../helper/SendEmail");
// const cloudinary = require("cloudinary");
var ObjectId = require('mongodb').ObjectId;
var Notification = require("../models/Notification")
var Post  = require("../models/Post");
var QRCode = require('qrcode');
const { createCanvas, loadImage } = require("canvas");

const QRReader = require('qrcode-reader');
const fs = require('fs');
const jimp = require('jimp');

// async function Usersignup(req, res) {
//   // try{
//   const { email, username, password, role } = req.body;

//   //console.log(req.files)
//   if (
//     email == "" ||
//     password == "" ||
//     username == "" ||
//     role == ""
//   ) {
//     var response = {
//       status: 201,
//       message:
//         "email, username, role and password and Image can not be empty !!",
//     };
//     return res.status(201).send(response);
//   }

//   let datas = await User.findOne({ username });
//   if (datas) {
//     res.status(201).json({
//       status: 201,
//       success: false,
//       message: "Username Already Exists",
//     });
//     return;
//   }
//   let data = await User.findOne({ email });
//   if (data) {
//     res.status(201).json({
//       status: 201,
//       success: false,
//       message: "Email Already Exists",
//     });
//     return;
//   }
//   if (req.files.length > 1) {
//     const myCloud = [];
//     for (var a = 0; a < req.files.length; a++) {
//       const img = await cloudinary.v2.uploader.upload(req.files[a].path, {
//         folder: "/USERS",
//       });
//       myCloud.push(img);
//     }

//     const userdata = {
//       name: req.body.name,
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//       username: req.body.username,
//       email: req.body.email,
//       password: validation.hashPassword(req.body.password),
//       mob_no: req.body.mob_no,
//       bio: req.body.bio,
//       bio_dob: req.body.bio_dob,
//       role: req.body.role,
//       profile_type: req.body.profile_type,
//       address: req.body.address,
//       images: {
//         public_id: myCloud[0].public_id,
//         url: myCloud[0].secure_url,
//       },
//       cimages: {
//         public_id: myCloud[1].public_id,
//         url: myCloud[1].secure_url,
//       },
//     };

//     const user = await User.create(userdata);

//     var response = {
//       status: 200,
//       message: `${role} signup successfully`,
//       data: user,
//     };
//     return res.status(200).send(response);
//   } else {
//     const myCloud = await cloudinary.v2.uploader.upload(req.files[0].path, {
//       folder: "/USERS",
//     });

//     const userdata = {
//       name: req.body.name,
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//       username: req.body.username,
//       email: req.body.email,
//       password: validation.hashPassword(req.body.password),
//       mob_no: req.body.mob_no,
//       bio: req.body.bio,
//       bio_dob: req.body.bio_dob,
//       role: req.body.role,
//       profile_type: req.body.profile_type,
//       location: req.body.location,
//       images: {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       },
//     };

//     const user = await User.create(userdata);

//     var response = {
//       status: 200,
//       message: `${role} signup successfully`,
//       data: user,
//     };
//     return res.status(200).send(response);
//   }
//   // } catch (error) {
//   //     var response = {
//   //       errors:error,
//   //       status: 400,
//   //       message: "Operation was not successful",
//   //     };

//   //     return res.status(400).send(response);
//   // }
// }


async function Usersignup(req, res) {
  try{
  const { email, password, role } = req.body;

  if (email == "" || password == "" || role == "") 
  {
    var response = {
      status: 201,
      message:
        "email, role and password can not be empty !!",
    };
    return res.status(201).send(response);
  }

  //console.log(req.files)
  if(role == "USER"){
    
  const {username} = req.body;
    if (username == "") 
    {
      var response = {
        status: 201,
        message:
          "username can not be empty !!",
      };
      return res.status(201).send(response);
    }

    let datas = await User.findOne({ username });
    
    if (datas) {
      res.status(201).json({
        status: 201,
        success: false,
        message: "Username Already Exists",
      });
      return;
    }
    let data = await User.findOne({ email });
    if (data) {
      res.status(201).json({
        status: 201,
        success: false,
        message: "Email Already Exists",
      });
      return;
    }
    const userdata = {
      username: req.body.username,
      email: req.body.email,
      password: validation.hashPassword(req.body.password),
      role: req.body.role,
    };
  
    const user = await User.create(userdata);
  
    const token = validation.generateUserToken(
      user.email,
      user._id,
      user.role,
      "logged",
      1
    );
    // console.log(token);
    var response = {
      status: 200,
      message: `${role} signup successfully`,
      data: user,
      token:token,
    };
    return res.status(200).send(response);
  } else {
    //console.log(req.bod
    
    let data = await User.findOne({ email });
    if (data) {
      res.status(201).json({
        status: 201,
        success: false,
        message: "Email Already Exists",
      });
      return;
    };

    if(req.files.length > 1){
      // const myCloud = [];
      // for (var a = 0; a < req.files.length; a++) {
      //   const img = await cloudinary.v2.uploader.upload(req.files[a].path, {
      //     folder: "/USERS",
      //   });
      //   myCloud.push(img);
      // }
      const userdata = {
        name: req.body.name,
        contact_person: req.body.contact_person,
        title: req.body.title,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: validation.hashPassword(req.body.password),
        role: req.body.role,
        images:req.files[0].filename,
        cimages:req.files[1].filename,
        // username: req.body.username,
        // mob_no: req.body.mob_no,
        // bio: req.body.bio,
        // bio_dob: req.body.bio_dob,
        // profile_type: req.body.profile_type,
        // location: req.body.location,
        // images: {
        //   public_id: myCloud[0].public_id,
        //   url: myCloud[0].secure_url,
        // },
        // cimages: {
        //   public_id: myCloud[1].public_id,
        //   url: myCloud[1].secure_url,
        // },
      };
  

      const user = await User(userdata);

      await user.save();
  
      const token = validation.generateUserToken(
        user.email,
        user._id,
        user.role,
        "logged",
        1
      ); 
      var response = {
        status: 200,
        message: `${role} signup successfully`,
        data: user,
        token:token
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: `Upload Logo and Banner images`,
      };
      return res.status(200).send(response);
    }
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


async function Usersignin(req, res) {
  try {
    const { email, username, password, role } = req.body;

    if (email == "" || password == "" || role =="") {
      var response = {
        status: 201,
        message: "email password and role can not be empty !!",
      };
      return res.status(201).send(response);
    } else {
      // var data = await User.findOne(email ? { email } : { username });
      var data = await User.findOne({email:email});
      // console.log(data);
      if (data) {
        // console.log(data);
        if(data.role !=role){
          var response = {
            status: 201,
            message: `U can't Login as ${role}`,
          };
          return res.status(201).send(response);
        }
        // console.log(data);
        // console.log(data.password);
        // console.log(validation.comparePassword(password,data.password));
        if (validation.comparePassword(data.password, password)) {
          const token = validation.generateUserToken(
            data.email,
            data._id,
            data.role,
            "logged",
            1
          );

          data.ActiveStatus = "Activate";
          data.save();

          var response = {
            status: 200,
            message: "User signin successfully",
            data: data,
            token: token,
          };
          const options = {
            // maxAge: 5000,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true, // The cookie only accessible by the web server
            //signed: true,  // Indicates if the cookie should be signed
            //secure:true,
            //sameSite:None,
          };

          return res.status(200).cookie("token", token, options).send(response);
        } else {
          var response = {
            status: 201,
            message: "Incorrect email or password",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          data: data,
          message: "Incorrect username or password",
        };
        return res.status(201).send(response);
      }
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


async function GetAllUser(req, res) {
  try {
    const user = await User.find(req.query)
      .populate({ path: "followers", select: ["email", "username",'images'] })
      .populate({ path: "following", select: ["email", "username",'images'] })
      .populate({ path: "story", select: ["caption", "images",'seen_by'] })
      .populate({ path: "category",select: ["name", "image"] })
      .populate({ path: "subcategory",select: ["name", "image"] });



    if (user) {
      var response = {
        status: 200,
        data: user,
        message: "successfull",
      };

      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "No User Found",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function GetUser(req, res) {
  try {
    const user = await User.findById(req.params.id).populate({ path: "followers", select: ["email", "username",'images'] })
                                                   .populate({ path: "following", select: ["email", "username",'images'] })
                                                   .populate({ path: "story", select: ["caption", "images",'seen_by'] })
                                                   .populate({ path: "category",select: ["name", "image"] })
                                                   .populate({ path: "subcategory",select: ["name", "image"] });

    if (user) {
      var response = {
        status: 200,
        data: user,
        message: "successfull",
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "No User Found",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function DeleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    console.log(user);
    if (user) {
      // if (user.cimages) {
      //   const imageId = user.cimages[0].public_id;
      //   await cloudinary.v2.uploader.destroy(imageId);
      // }
      // const imageId = user.images[0].public_id;
      // await cloudinary.v2.uploader.destroy(imageId);
      // await User.remove()

      // User.findByIdAndDelete(req.params.id, (err, docs) => {
      //   if (err) {
      //     var response = {
      //       status: 201,
      //       message: err,
      //       messages: "User delete failed",
      //     };
      //     return res.status(201).send(response);
      //   } else {
      //     var response = {
      //       status: 200,
      //       message: "User removed successfully",
      //       data: docs,
      //     };
      //     return res.status(200).send(response);
      //   }
      // });

      const data = {
        ActiveStatus : "DeActivate",
      }
      User.findByIdAndUpdate(
        req.params.id,
        { $set: data },
        { new: true },
        async(err, docs) => {
          if (err) {
            var response = {
              status: 201,
              message: err,
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "User DeActivated successfully",
              data: docs,
            };
            return res.status(200).send(response);
          }
        }
      )
    } else {
      var response = {
        status: 201,
        message: "No User Found",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function UpdateUser(req, res) {
  try{
    if (req.params.id != "") {
      // const {location} = req.body;
      const user = await User.findById(req.params.id);
      if (user) {
        if(user.role == "USER"){
          if(req.files.length>0){
            // const myCloud = await cloudinary.v2.uploader.upload(req.files[0].path, {
            //   folder: "/USERS",
            // });
            // res.json("hello")

            const data = {
              // name: req.body.name,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              email: req.body.email,
              mob_no: req.body.mob_no,
              bio: req.body.bio,
              gender:req.body.gender, 
              about_us: req.body.about_us,
              address: req.body.address,
              latitude:req.body.latitude,
              longitude:req.body.longitude,
              images: req.files[0].filename,
              // images: {
              //   public_id: myCloud.public_id,
              //   url: myCloud.secure_url,
              // },
            }
            User.findByIdAndUpdate(
              req.params.id,
              { $set: data },
              { new: true },
              async(err, docs) => {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                  };
                  return res.status(201).send(response);
                } else {

                  if(req.body.category){
                    docs.category = [];
                    //console.log(req.body.category.length);
                    if(req.body.category.length == 24){
                      docs.category= ObjectId(req.body.category)
                      await docs.save();
                    }
                    //console.log(typeof req.body.subcategory);
                    else{
                    for(var b=0; b<req.body.category.length;b++){
                      //console.log(typeof req.body.subcategory[b]);
                      //console.log(docs.subcategory[b]);
                      docs.category[b] = ObjectId(req.body.category[b])
                      //docs.subcategory.push(req.body.subcategory[b])
                      await docs.save();
                    }}
                    
                    if(req.body.subcategory){
                      docs.subcategory = [];
                        if(req.body.subcategory.length == 24){
                          docs.subcategory= ObjectId(req.body.subcategory)
                          await docs.save();
                        }
                        //console.log(typeof req.body.subcategory);
                        else{
                        for(var b=0; b<req.body.subcategory.length;b++){
                          //console.log(typeof req.body.subcategory[b]);
                          //console.log(docs.subcategory[b]);
                          docs.subcategory[b] = ObjectId(req.body.subcategory[b])
                          //docs.subcategory.push(req.body.subcategory[b])
                          await docs.save();
                        }}
                   }
                   }
                  var response = {
                    status: 200,
                    message: "User Updated successfully",
                    data: docs,
                  };
                  return res.status(200).send(response);
                }
              }
            )
          } else {
            const data = {
              // name: req.body.name,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              email: req.body.email,
              mob_no: req.body.mob_no,
              bio: req.body.bio,
              gender:req.body.gender, 
              about_us: req.body.about_us,
              address: req.body.address,
              latitude:req.body.latitude,
              longitude:req.body.longitude,
            }
            User.findByIdAndUpdate(
              req.params.id,
              { $set: data },
              { new: true },
              async(err, docs) => {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                  };
                  return res.status(201).send(response);
                } else {
                  //console.log(req.body);
                 if(req.body.category){
                  docs.category = [];
                  //console.log(req.body.category.length);
                  if(req.body.category.length == 24){
                    docs.category= ObjectId(req.body.category)
                    await docs.save();
                  }
                  //console.log(typeof req.body.subcategory);
                  else{
                  for(var b=0; b<req.body.category.length;b++){
                    //console.log(typeof req.body.subcategory[b]);
                    //console.log(docs.subcategory[b]);
                    docs.category[b] = ObjectId(req.body.category[b])
                    //docs.subcategory.push(req.body.subcategory[b])
                    await docs.save();
                  }}

                  if(req.body.subcategory){
                    docs.subcategory = [];
                      if(req.body.subcategory.length == 24){
                        docs.subcategory= ObjectId(req.body.subcategory)
                        await docs.save();
                      }
                      //console.log(typeof req.body.subcategory);
                      else{
                      for(var b=0; b<req.body.subcategory.length;b++){
                        //console.log(typeof req.body.subcategory[b]);
                        //console.log(docs.subcategory[b]);
                        docs.subcategory[b] = ObjectId(req.body.subcategory[b])
                        //docs.subcategory.push(req.body.subcategory[b])
                        await docs.save();
                      }}
                 }
                 }
                  var response = {
                    status: 200,
                    message: "User Updated successfully",
                    data: docs,
                  };
                  return res.status(200).send(response);
                }
              }
            )
          }
        } else {
          if(req.files.length>0){

      //       const myCloud = [];
      // for (var a = 0; a < req.files.length; a++) {
      //   const img = await cloudinary.v2.uploader.upload(req.files[a].path, {
      //     folder: "/USERS",
      //   });
      //   myCloud.push(img);
      // }

      // const myCloud = await cloudinary.v2.uploader.upload(req.files[0].path, {
      //   folder: "/USERS",
      // });

      const userdata = {
        name: req.body.name,
        contact_person: req.body.contact_person,
        title: req.body.title,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        // username: req.body.username,
        email: req.body.email,
        gender:req.body.gender, 
        about_us: req.body.about_us,

        // password: validation.hashPassword(req.body.password),
        mob_no: req.body.mob_no,
        // bio: req.body.bio,
        // bio_dob: req.body.bio_dob,
        // role: req.body.role,
        // profile_type: req.body.profile_type,
        address: req.body.address,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        images:req.files[0].filename,
        // images: {
        //   public_id: myCloud.public_id,
        //   url: myCloud.secure_url,
        // },
        // images: {
        //   public_id: myCloud[0].public_id,
        //   url: myCloud[0].secure_url,
        // },
        // cimages: {
        //   public_id: myCloud[1].public_id,
        //   url: myCloud[1].secure_url,
        // },
      };
            User.findByIdAndUpdate(
              req.params.id,
              { $set: userdata },
              { new: true },
              async(err, docs) => {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                  };
                  return res.status(201).send(response);
                } else {

                  if(req.body.category){
                    docs.category = [];
                    //console.log(req.body.category.length);
                    if(req.body.category.length == 24){
                      docs.category= ObjectId(req.body.category)
                      await docs.save();
                    }
                    //console.log(typeof req.body.subcategory);
                    else{
                    for(var b=0; b<req.body.category.length;b++){
                      //console.log(typeof req.body.subcategory[b]);
                      //console.log(docs.subcategory[b]);
                      docs.category[b] = ObjectId(req.body.category[b])
                      //docs.subcategory.push(req.body.subcategory[b])
                      await docs.save();
                    }}
                    
                    if(req.body.subcategory){
                      docs.subcategory = [];
                        if(req.body.subcategory.length == 24){
                          docs.subcategory= ObjectId(req.body.subcategory)
                          await docs.save();
                        }
                        //console.log(typeof req.body.subcategory);
                        else{
                        for(var b=0; b<req.body.subcategory.length;b++){
                          //console.log(typeof req.body.subcategory[b]);
                          //console.log(docs.subcategory[b]);
                          docs.subcategory[b] = ObjectId(req.body.subcategory[b])
                          //docs.subcategory.push(req.body.subcategory[b])
                          await docs.save();
                        }}
                   }
                   }

                  var response = {
                    status: 200,
                    message: "SuperMart Updated successfully",
                    data: docs,
                  };
                  return res.status(200).send(response);
                }
              }
            )
          } else {
            const data = {
              name: req.body.name,
              contact_person: req.body.contact_person,
              title: req.body.title,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              //username: req.body.username,
              email: req.body.email,
              gender:req.body.gender, 
              mob_no: req.body.mob_no,
              about_us: req.body.about_us,
              
              //bio: req.body.bio, 
              //about_us: req.body.about_us,
              address: req.body.address,
              latitude:req.body.latitude,
              longitude:req.body.longitude,
            }
            User.findByIdAndUpdate(
              req.params.id,
              { $set: data },
              { new: true },
              async(err, docs) => {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                  };
                  return res.status(201).send(response);
                } else {
                  //console.log(req.body);
                  if(req.body.category){
                    docs.category = [];
                    //console.log(req.body.category.length);
                    if(req.body.category.length == 24){
                      docs.category= ObjectId(req.body.category)
                      await docs.save();
                    }
                    //console.log(typeof req.body.subcategory);
                    else{
                    for(var b=0; b<req.body.category.length;b++){
                      //console.log(typeof req.body.subcategory[b]);
                      //console.log(docs.subcategory[b]);
                      docs.category[b] = ObjectId(req.body.category[b])
                      //docs.subcategory.push(req.body.subcategory[b])
                      await docs.save();
                    }}
                    
                    if(req.body.subcategory){
                      docs.subcategory = [];
                        if(req.body.subcategory.length == 24){
                          docs.subcategory= ObjectId(req.body.subcategory)
                          await docs.save();
                        }
                        //console.log(typeof req.body.subcategory);
                        else{
                        for(var b=0; b<req.body.subcategory.length;b++){
                          //console.log(typeof req.body.subcategory[b]);
                          //console.log(docs.subcategory[b]);
                          docs.subcategory[b] = ObjectId(req.body.subcategory[b])
                          //docs.subcategory.push(req.body.subcategory[b])
                          await docs.save();
                        }}
                   }
                   }
                   
                  var response = {
                    status: 200,
                    message: "Supermart Updated successfully",
                    data: docs,
                  };
                  return res.status(200).send(response);
                }
              }
            )
          }
        }
        
      } else {
        var response = {
          status: 201,
          message: "No User Found",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Enter User id",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function UpdatePassword(req, res) {
  try {
    if (req.params.id != "") {
      const user = await User.findById(req.params.id)

      if (user) {
        const {old_password, new_password, repeat_password} = req.body;

        if (validation.comparePassword(user.password, old_password)) {
          if(new_password == repeat_password){
            
            const data = {
              password:validation.hashPassword(new_password),
            };
             User.findByIdAndUpdate(
              req.params.id,
              { $set: data },
              { new: true },
              (err, docs) => {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                  };
                  return res.status(201).send(response);
                } else {
                  var response = {
                    status: 200,
                    message: "Password Updated successfully",
                    data: docs,
                  };
                  return res.status(200).send(response);
                }
              }
            );
          } else {
            var response = {
              status: 201,
              message: "repeat password not matched",
            };
            return res.status(201).send(response);
          }
        } else {
          var response = {
            status: 201,
            message: "Incorrect old password",
          };
          return res.status(201).send(response);
        }
  
      } else {
        var response = {
          status: 201,
          message: "Password Not Found",
        };
        return res.status(201).send(response);
      }

    } else {
      var response = {
        status: 201,
        message: "Please Enter User ID",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function Logout(req, res) {
  try {
    // res.clearCookie('refreshToken')
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      // .cookie("accessToken", null, { expires: new Date(Date.now()), httpOnly: true })
      // .cookie("refreshToken", null, { expires: new Date(Date.now()), httpOnly: true })
      // .cookie("authSession", null, { expires: new Date(Date.now()), httpOnly: true })
      // .cookie("refreshTokenID", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    var response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function Following(req, res) {
  try{
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    // console.log(data);

    const user = await User.findById(req.params.followId);

    if (!user) {
      var response = {
        status: 201,
        message: "No User Found",
      };
      return res.status(201).send(response);
    }

    // Can't Follow urself
    if(user_id.toString() === user._id.toString())
    {
      var response = {
        status: 201,
        message: "U can not Follow urself",
      };
      return res.status(201).send(response);
    }


    const users = await User.findById(user_id);

    if (users) {
      var isfollow = false;

      //console.log(users.following.length);
      for (var a = 0; a < users.following.length; a++) {
        var following = users.following[a];

        if (following.toString() == user._id.toString()) {
          isfollow = true;
          break;
        }
      }
      // console.log(isfollow);

      if (isfollow) {

        // remove into follower list
        user.followers.pull(user_id);
        await user.save();
        // remove into following list
        users.following.pull(user._id);
        await users.save();

        // unfollowed so Delete Notification
        const data = await Notification.aggregate([{$match:{
                                                      $and:[
                                                          {'owner':user._id, 'user':users._id},
                                                          {'type':"follow"}
                                                      ]
                                                      }
                                                      }])
                                                      
        //console.log(data);
        await Notification.findByIdAndDelete(data[0]._id,{new:true});
        
        var response = {
          status: 200,
          message: "User has been UnFollowed",
          data: users,
        };
        return res.status(200).send(response);
      } else {
        // add into follower list
        user.followers.push(user_id);
        await user.save();
        // add into following list
        users.following.push(user._id);
        await users.save();

        // Add Notification
        if(users.role == "USER"){
          var not = {
            owner:user._id,
            user:users._id,
            message: `${users.username} started following you.`,
            type:"follow",
          }
          await Notification.create(not)
        } else {
          var not = {
            owner:user._id,
            user:users._id,
            message: `${users.name} started following you.`,
            type:"follow",
          }
          await Notification.create(not)
        }
        var response = {
          status: 200,
          message: "User has been Followed.",
          data: users,
        };
        return res.status(200).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "No User Found",
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


async function ResetPassword(req, res) {
  try {
    const { email, username } = req.body;
    if (email == "" || username == "") {
      var response = {
        status: 201,
        message: "email or username can not be empty !!",
      };
      return res.status(201).send(response);
    }

    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    var datas = await User.findOne(email ? { email } : { username });

    if (!datas) {
      var response = {
        status: 201,
        message: "User Not Found !!",
      };
      return res.status(201).send(response);
    }

    const data = await Sendemail.sendEmail(
      email,
      datas.username,
      "Password reset",
      result
    );
    //console.log(data);
    if (data.error) {
      var response = {
        status: 201,
        message: "Password Sending Failed !!!!",
        error: data.error,
      };
      return res.status(201).send(response);
    } else {
      datas.password = validation.hashPassword(result);
      await datas.save();
      // console.log(result);
      var response = {
        status: 200,
        message: "Password has been successfully send to your EmailId.",
        messageId: data.messageId,
        password: result,
      };
      return res.status(200).send(response);
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


async function UpdateBanner(req, res) {
  try{
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;

    const user = await User.findById(user_id)
    if(user.role == "SUPERMART"){
      //console.log(req.files);

      // const myCloud = await cloudinary.v2.uploader.upload(req.files[0].path, {
      //   folder: "/USERS",
      // });
      const datas = {
            cimages: req.files[0].filename,

            // cimages: {
            //     public_id: myCloud.public_id,
            //     url: myCloud.secure_url,
            // },
      }
      User.findByIdAndUpdate(user_id,
        { $set: datas },
        { new: true },
        async(err, docs) => {
          if (err) {
            var response = {
              status: 201,
              message: err,
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "Banner Updated successfully",
              data: docs,
            };
            return res.status(200).send(response);
          }
        }
      )
    } else {
      var response = {
        status: 201,
        message: "Not Authorized to change banner image",
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


async function Search(req, res) {
  try{

    const datas = jwt_decode(req.headers.token);
    const user_id = datas.user_id;
    // console.log(data);

    const user = await User.findById(user_id);

    let search = req.body.search.replace(/[^\w\s*]/gi, '')

    console.log(search);
    if(search == 0 || search == null){
        var response = {
          status: 201,
          message: "can't search empty field",
        };
        return res.status(201).send(response);
    }
    const data = await User.aggregate([
                                {$match:{
                                    $or:[
                                      {"first_name" : { $regex: `${search}`, $options: 'i' }},
                                      {"name" : { $regex: `${search}`, $options: 'i' }},
                                      {"last_name" : { $regex: `${search}`, $options: 'i' }},
                                      {"email" : { $regex: `${search}`, $options: 'i' }},
                                      {"contact_person" : { $regex: `${search}`, $options: 'i' }}
                                    ]
                                    }
                                    }])

    
    const post = await Post.aggregate([
                                {$match:{
                                    $or:[
                                      {"type" : { $regex: `${search}`, $options: 'i' }},
                                      {"caption" : { $regex: `${search}`, $options: 'i' }},
                                      {"header" : { $regex: `${search}`, $options: 'i' }},
                                      {"brand" : { $regex: `${search}`, $options: 'i' }},
                                      //{"subcategory" : { $regex: `${search}`, $options: 'i' }}
                                    ]
                                    }
                                    }])
                                //.sort({createdAt: -1})
    // console.log(data.length);
    if (data.length>0 || post.length>0) {
      let arr =[];
      let count =0;
      const length = data.length;
      data.forEach((doc)=>{
          if(user._id.toString() != doc._id.toString())
          {
            arr.push(doc)
          }
          count++;
          if(count === length){
            var response = {
              status: 200,
              message: "successfull",
              users: arr,
              posts:post
            };
            return res.status(200).send(response);
          }
      })
    } else {
      var response = {
        status: 201,
        message: "No Data Found",
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


async function GetRecommendedUser(req, res) {
  try {

    const datas = jwt_decode(req.headers.token);
    const user_id = datas.user_id;

    const data = await User.findById(user_id);

    if(!data) {
      var response = {
        status: 201,
        message: "No User Found... plz Login First",
      };
      return res.status(201).send(response);
    }
    // console.log(data)

    //const users = await User.find(req.query)
    //  .populate({ path: "followers", select: ["email", "username"] })
    //  .populate({ path: "following", select: ["email", "username"] })
    //  .populate({ path: "story", select: ["caption", "images",'seen_by'] })
    //  .populate({ path: "category",select: ["name", "image"] })
    //  .populate({ path: "subcategory",select: ["name", "image"] })
    //  .sort({createdAt: -1});

    // Get Random 10 user from table
    const users = await User.aggregate([{$sample: { size : 10 }}]).exec();

    if (users) {
      let arr =[];
      let count =0;
      const length = users.length;
      if(length>0){
        users.forEach((user)=>{
          if(user._id.toString()!=data._id.toString())
          {
            //console.log(data.following);
            if(!data.following.includes(user._id))
            {
              arr.push(user);
            }
          }
          count++;
          if(length===count)
          {
            var response = {
              status: 200,
              data: arr,
              message: "successfull",
            };
            return res.status(200).send(response);
          }
        })
      } else {
        var response = {
          status: 200,
          data: arr,
          message: "successfull",
        };
        return res.status(200).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "No User Found",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    response = {
      errors: error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
  }
}


async function Rating(req,res){
  try{
    
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;

    const {rating} = req.body

    const user = await User.findById(user_id)

    if(rating == "" || rating == null)
    {
      var response = {
        status: 201,
        message: "Rating can not be Empty",
      };
    return res.status(201).send(response);
    }

    if(rating > 5 || rating < 1)
    {
      var response = {
        status: 201,
        message: "Enter Rating between 1 to 5",
      };
    return res.status(201).send(response);
    }

    if(user){
          //await Post.remove()
          const data = {
            Rating:rating,
          };

          User.findByIdAndUpdate(
            user.id,
            { $set: data },
            { new: true },
            async(err, docs) => {
              if (err) {
                var response = {
                  status: 201,
                  message: err,
                };
                return res.status(201).send(response);
              } else {
                var response = {
                  status: 200,
                  message: "Rating Updated Successfully",
                  data: docs,
                };
                return res.status(200).send(response);
              }
            }
          )
      } else{
          var response = {
              status: 201,
              message: "No User Found",
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


async function UpdateRole(req,res){
  try{

    const datas = jwt_decode(req.headers.token);
    const user_id = datas.user_id;

    const user = await User.findById(user_id);

    if(!user) {
      var response = {
        status: 201,
        message: "No User Found... plz Login First",
      };
      return res.status(201).send(response);
    }

   const data = {
    role:req.body.role
   }

    User.findByIdAndUpdate(
      user._id,
      { $set: data },
      { new: true },
      async(err, docs) => {
        if (err) {
          var response = {
            status: 201,
            message: err,
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "User Updated successfully",
            data: docs,
          };
          return res.status(200).send(response);
        }
      }
    )
   } catch (error) {
      response = {
        errors:error,
        status: 400,
        message: "Operation was not successful",
      };
  
      return res.status(400).send(response);
  }
}


async function QrCode(req,res){
  try{

    const width = 150;
    const cwidth = 50;

    const {data} = req.body
    
    if(data === null || data===""){
      response = {
        status: 201,
        message: "Enter the data to make Qrcode",
      };
      return res.status(201).send(response);
    }
    
    // const dataz = {
    //   name:req.body.data,
    //   age:25
    // }

    QRCode.toDataURL(data,async(error, url)=>{
      // QRCode.toDataURL(JSON.stringify(dataz), function (error, url) {
      // console.log(url)
      // console.log(qr.decode("url"))
      const canvas = createCanvas(width, width);
      
      QRCode.toCanvas(
        canvas,
        url,
        {
          // errorCorrectionLevel: "H",
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }
      );

      const center_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABEVBMVEX/////vgCfB6khKzb/vAD+vxf/ugCYAKP/1oacAKaXALD/uQCcAKf///3/8M7/wQDw3fEbJjL/13/z5PT/8tb/5Kr68vr/+u3nzOm5YsD//P/MkdH//PTr1e3cteD16vbWqdrIh83gvOOpMrL/5rP/6bzlxuf/9d+zUrv/ykf/35z/0mvDfcn/3ZQAFjgOHCrQm9WvRbf/xTP/8dK9bMT/1HXJi8//xjv/zVrAdMayTrqsObT/z2Dv7/AAFSUABhxES1Pg4OIAABSChooAHTi4jhvMzc+mIa+0trh/g4ifoaVdYmkxOUNiZ27lrA27vb/SnxREQTFVSy+xiR0AEDkBIjZoVyyJbibuswk2ODOceiJEw5mmAAAMzElEQVR4nO2d+1viOBfHCxZqhwLCiChUxQsgCIq38S46zgwzzm1335l5Z/f//0O2RaFJe5ImaVJcn35/2We0SD57kpNzTtJE0xIlSpQoUaJEiRIlSpQoUaJEiRIlSgRpvX4w2tpp1GbdDmXaMEzLkWFtzrolinRgpB9lGYNZt0WJjs30VEZr1q1RoGXDA0xb6Vk3R4FWLIQwbbzAoWiigGnzfNbtka51AyO0DmbdIOnyE45m3SDpqvkIL2bdIPlKY57mBY5D7QInfIFz/gbmTI3lWbdHvjaxgWguzbo98oU50xc4WTjaQgaiWZ91a1Sojkbeq7NujQoteN30RQbeGtpNX2Yn1bTBtJsar2fdFkj56lFzu9vvz8+Xy+e9jY36Wmt1iaviUpsQWiuqGikmu73dvTotZnNZV7qj1CvTlWEY1uVOfW2BlXMy6T8jP2MXurvFJ66Up8yrqcuwLJf0oL7MQlmzxiPRfCYmtJvlwzFbKiCPcAJqGtbOYCH0b47jGst6DvHMYv8wB8LBhE+Uo0GYBxkYjs19/yfWW5trm/G6nqNyhkxHJHyEvFij/+3WSm8d+efqYCftDGe3o8dWfVucT9HxKIQupGH2WO2xfG65JeLJB4+Vcj3JrhyG4tEJXUdirDD4yqV62sFDPxcD4uKJ41hC8UIJXXvshHmdgYnjjREVVxibp2x4DIQu48o65btejwzoQ0qrU5UMMx8LodtX3xC/bNUI2O/RiOHzjaDylRQHHxuhw2iR/OoIBkybDUWADh8HHjOhOxzBuX0d6qJjQjXlqWaGk4+Z0GVsQF+ZjtOG7Q5b/9R1JDRlJnSG1goQsLZI41B+AS5fztH5HCwnNs1lU5nD086pzk/ojEag2S3LBB5VkPk3aQPQZdMzu/OVwmI1n3cfX8wKEMILvkvHRpAR7tIRZJ/liHQOXGe+2c5jHygIEbo9Ffj2hZ5/zjd3JANWSOGZ7tB1j4BPiBKmzUvIpy41DkwvcLMMySVU+wzuoA7eSdOGPyNM6IwwOMJZ2jx3UotxvcBqyAUsgAbUs6mTAuVDwoRO1ksMxpeWG4P6QHbuNA+NQD3XaeZpn4pA6KSOcdZmqqdAD83q89WQz0UhdMZZfKtNQA91umeXMPjQD0YhjBGxEuyh2WKF5ZNHHqHhypwm6IyI8XTUcqCHZlOhfPZiodKfv5rGNLWl9dXlzUHPLbIEM1kiohlDvSkfmCT0bJ/mXqrN/m4nlctidcWM9/v1Vn3HZKW00srriPah7ufbJY6//FH3KgVWTDP4g7WWM6sxMVqXigGrGV9jsxnS9HfU7ejEqk0m+PzyOVB4CUpxubudwlvsdFDwuXzhhExHIHQsubbFYEil+y7bvu6WzSxCjzV3Q0saIKGjFgOjQocaACxDD5V1hoyYRKhpm6GMlqVqD3Qbb7mebQafaTIm/GRCTVtLQ8ltDEPRZ8HsYSBEs7vMBTcaoVbrhZjRCFnaEFMVdzLZ3cADTN2ThVDTVkd0M5q0YrGgbHyayHX9fCd89dKw7zsm1Qsfh6LsZN4RNtEHhqBd5uJjINQa1J4qv5+eYYC6b5LoM6w28RJqq6Sa6NiIsv0pFmzrKdzHUOtt4oTa0hZlMJo9qYAVDDCDxaHVM84OykyoaRcURKkbahbRfFA/xBKJrggfKyH2ColCZ2Oj8wQO2IaqGRIJtRUyosTg7RQFxLpoN6SiH52Qgihvg+k8YiY9hQBWO4IG5CHULokeVZYRC+ggzLaRX3BPEUKENdJiqKyRaKMcWSTbBQumCgi118ToRo47vUIAc169KVitUUbo28COSMqcuI1YCkkHA8UMlYRaj+RtjOhlKRt1o53pjyMNQX5CbAc7ZsRGZEKkjyJudDvSEBQgXCD0U2srKmATQclNvUw/OiAnoe9tGaSbRpww8kgw4xXVyhIAeQlJey+i+hoko9BPJz88ieZEBQkJ/jTizoQ26kcnCZMcQG5C7UDF7pIO0kcnRQtJgPyEq7ARzY0IgAWkjx4+/Sy47BQXobYDGjHSZkRkUp+Eo31ZgAKEBCNGiNyaHs0kmAFWRuMjJCQZESZ9xIT6Y9LblAcoQtgCjSj+8sw2YsLHgLstrYuKEcJzovh84U32T27GjhyLRiV8AwY2ogMRMWHusfrrX/uNnxCOTk3B2nDGb8IrmX1UjBDe+iwYuKGOdBxxV+QCihHWwS2lYkcreOW1x4B0UTKgGCE8JVoifwoBGq/B5KOm9MyEdx/vP326f/hwDf4W9KaGyErbrmfCDP5vtYQPt8ObfVc3w88fgN+vgIQCOaKNmHBbk5LTsxB+vLkpzU1UGn4JMg6ggSjiTBG34oYztnQLQoTXn4dziErDzw+BrroMDUSRt7q9qU93I9KzOAjvSvsY4O0d0LAl8F0n/lNcED+Ta8sNR4mE16USBvgFbho0IwpMF2VsqsinFJgwQHiLAc4NIQtqsKsR2OmG5IUViUkvjfDhBgMsfSU0DaoN85cUkdw+W8WKNYCKxaIEwuu3GODczUdC2xoQYZp3Sf/E66RnWLEG4vv2/v1vEUic8H7fR/id0LY1MG7jre177XU6KdXNFP/4c+/du72/vvEj4oT4IKTYECwq8h42dIR1Ulq4Vvzfj3HTSj/+4EbECD8MfYSlT4TGgZEp7/rMvNdJO2iaGAT8tjdp0M/fkQj9ndQxojfZX6OhDZgi8gamntWyXa1IM+Gvn5MG/fw/rxExws/+XjpX+jz95S3aY8HVUk4bVr2Bl23Ts8KfXoPmIhF+CRDO3Xx9cpBf3z5IJkT6pa5RJ/vfe16DfkQiDPA52t9/+HD34aG0v38fRsjpaZDEabdJNWEGIdyTbUOX8cZJpZz/oDYEPQ0nITIMK/TiU/HvacNKf0UivAUJJ6AoIZRccM74VaSThsRrxX/eTU34PhLhp4AvRUck6kvXIEK+pQt0eqCGM67+fvI1P7lNiBN+vKEQDtEsEYza+OLSMkciUfz9517JmQz3fvHy+Qjv/DM+otIt+iRUbePc/cVX9y2+/1Wa+8Uf0fijNspAvEGHIZg98RVM85ypUnEsfkAf4XeyEYfYg9BKMN9BEVJXX9gJCfNFwIRa9EoULQ5VSRiIvSejEK9mwGEpVzWxr6JiwUCoPcCIvmoGmB7yBW0qympMhNonCPGtr2QKFjH4FhDlLqHxEGr3AcTSjb8mDO1v41sEzscFCNW8v+/jFdPhrb8iDJ67Y5KPWgIUUnZSS+iYcVrWL+0PvwRrNfAw5DpLoRCXKyWszFx//Lo/dPXlnnlhhu8lr9gmC8r64fXd3R2cLNQknF8mb0eQOCFZUGLBu8jNE3fHT3gBrh7yHWkifyVUIiG8Z9/gK3iHZoSzJAT3CfMuPMU24QsQgn6Ge1tbXHwihOAKN3c1ODYT8hPWwGNeuN/uesaE4G4h7k6qYkuCJEJwBd8h5Fw6jC/w5iaEXybl36QwPi6dWTESgttMRHbqz/MoUgDESQi/gxj9pSC67CipFh8h4aUgNcdjeIqPkNBHlV/iEckv8RDWSC89Kb/wKcqWTB5CMKdwD45QRjZRlDidg3CD8PKh9NNYgzqJhbBBersyhqt0uhEqAsyE8HskMThSV0cxEBIBlZ9M54p3oUqAkHSodVwXzURwNWyExDfx47r8MMJLGEyEJCcjsh9RTFW1hG/Ih2HF4WbGEl+qCies7ZAB47sMib6lKBLhAuXEtrj6qCtRwFDCOu0sszjv5xSe9OmEC5e08+goV5fIV16FDWsb1MPopB+eT5fohEEhDDn6Ms5BOJZgCkUk3BzRz72M5TRoTAWxTB8mrDVC+GZyC7DYORIQ4ULPCj1iN4akMCihfhogfD3YYjjT25jJ7aNCb9BihOubvRHTkeWG3OMgmSVymMQT4dJ6q3E+Yj133pjZbeoCQzFzfn58sTWyDIP97oBZWdAVf6KYeWW5YmR7BIwzlPErf8qLyH+/hdKj2BkQeR0qL6Gl+mbDcEROK3ISWmllt/6xI/Id9clHCN/2FLt2eRB5CK1ZOlFMPCfSchBa5qyHoKdF9te+2QmNg2fRQ5+UZz7FhpXQVHbtpqi2GZf32QgtY+U5GfBR9hXTAd9MhMYo/mSQRQWWW3MZCE31a7zCYrhZNpTQNOsx12O4FH47MJ3Qcvie3wD0afuQykgjtIxRY9bNZ1LhjHLjE5HQMo2d2O65jyy7e5gjQMKEDt7lQMEVMirV7p5C164BhJaT718O4i6GSlG1eeKaEsfECC3HdsbofO3ZOxeK7EL/KqOPb9F7RHUIx2UM02EzRzv11n+Zbiq73az0T646Gfc65FdWOn25ctxrbC78xwZeokSJEiVKlChRokSJEiVKlChRokSJEiVKlChRIlj/ApgIIGDBCEskAAAAAElFTkSuQmCC";
      const ctx = canvas.getContext("2d");
      const img = await loadImage(center_image);
      const center = (width - cwidth) / 2;
      ctx.drawImage(img, center, center, cwidth, cwidth);
      // console.log(ctx)
      // console.log(canvas.toDataURL("image/png"))

      response = {
        status: 200,
        message: "successful",
        image:url
        // image:canvas.toDataURL("image/png")
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


async function QrCodeRead(req,res){
  try{
    // console.log(req.files);
    
    // convert from buffer to Image
    fs.writeFileSync('./uploads/scan/image.png', req.files[0].buffer)
    const img = await jimp.read(fs.readFileSync('./uploads/scan/image.png'));
    
    const qr = new QRReader();

    // qrcode-reader's API doesn't support promises, so wrap it
    const value = await new Promise((resolve, reject) => {
        qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
        qr.decode(img.bitmap);
    });
    // console.log(value);
    response = {
        status: 200,
        message: "successful",
        data:value.result,
      };
    return res.status(200).send(response);
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
  Usersignup,
  Usersignin,
  Logout,
  GetAllUser,
  GetUser,
  DeleteUser,
  UpdateUser,
  Following,
  ResetPassword,
  UpdatePassword,
  UpdateBanner,
  Search,
  GetRecommendedUser,
  Rating,
  UpdateRole,
  QrCode,
  QrCodeRead
};



  
