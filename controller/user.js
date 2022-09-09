var User = require("../models/User");
var validation = require("../helper/validation");
const jwt_decode = require("jwt-decode");
// var bcrypt = require("bcryptjs");
var Sendemail = require("../helper/SendEmail");
// const cloudinary = require("cloudinary");
var ObjectId = require('mongodb').ObjectId;
var Notification = require("../models/Notification")
var Post  = require("../models/Post");
var QRCode = require('qrcode')
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
    const {data} = req.body
    
    if(data === null || data===""){
      response = {
        status: 201,
        message: "Enter the data to make Qrcode",
      };
      return res.status(201).send(response);
    }
    
    const dataz = {
      name:req.body.data,
      age:25
    }
    // QRCode.toDataURL(JSON.stringify(req.body), function (error, url) {
      QRCode.toDataURL(JSON.stringify(dataz), function (error, url) {
      // console.log(url)
      // console.log(qr.decode("url"))
      response = {
        status: 200,
        message: "successful",
        image:url
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
    // convert from buffer to Image
    const abc = fs.writeFileSync('image.png', req.files[0].buffer)
    
    const img = await jimp.read(fs.readFileSync('./image.png'));
    const qr = new QRReader();

    // qrcode-reader's API doesn't support promises, so wrap it
    const value = await new Promise((resolve, reject) => {
        qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
        qr.decode(img.bitmap);
    });
    // console.log(value.result);
    response = {
        status: 200,
        message: "successful",
        data:JSON.parse(value.result),
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



  
