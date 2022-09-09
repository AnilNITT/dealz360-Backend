var Post = require("../models/Post");
const fs = require('fs');
const multer  = require('multer')
const upload = multer({ dest: './uploads/Post' })
const jwt_decode = require("jwt-decode");
var User = require("../models/User");
const cloudinary = require("cloudinary");
var Notification = require("../models/Notification")


// Using Multer
// async function Addpost(req,res){
//     try{
//         const data = jwt_decode(req.headers.token);
//         const user_id = data.user_id;
//         // console.log(data);
        
//         let user = await User.findById(user_id)
//         // const file = [];
//         const { type, caption} = req.body;
//         const files = req.files

//         //console.log(req.files);
//         // convert images into base64 encoding
//         let imgArray = files.map((file) => {
//              let img = fs.readFileSync(file.path)
//              return encode_image = img.toString('base64')
//         })

//         //console.log(imgArray);
//         let result = imgArray.map(async(src, index) => {

//             // create object to store data in the collection
//             let data = {
//                 filename : files[index].originalname,
//                 contentType : files[index].mimetype,
//                 // imageBase64 : src,
//                 userId : user_id,
//                 caption : caption,
//                 type: type,
//             }

//             const check =await Post.findOne({filename:data.filename});
//             //console.log(check);
//             if(check){
//                 var response = {
//                     status: 201,
//                     message: `Duplicate Image.. Image Already Uploaded`,
//                     data: check,
//                 };
//                 return res.status(201).send(response);
//             }
    
//             let postUpload = new Post(data);
//             // mconsole.log(postUpload);
//             return await postUpload
//                     .save()
//                     .then(() => {

//                         var response = {
//                             status: 200,
//                             message: `${files[index].originalname} Uploaded Successfully...!`,
//                             data: postUpload,
//                         };
//                         return res.status(200).send(response);
//                         // return {data:postUpload, msg : `${files[index].originalname} Uploaded Successfully...!`}
//                     })
//                     .catch(error =>{
//                         console.log(error);
//                         if(error){
//                             if(error.name === 'MongoError' && error.code === 11000){
//                                 var response = {
//                                     status: 201,
//                                     error: `Duplicate ${files[index].originalname}. File Already exists! `,
//                                 };
//                                 return res.status(201).send(response);

//                                 // return Promise.reject({ error : `Duplicate ${files[index].originalname}. File Already exists! `});
//                             }
//                             return Promise.reject({ error : error.message || `Cannot Upload ${files[index].originalname} Something Missing!`})
//                         }
//                     })
//         });
    
//         Promise.all(result)
//             .then( msg => {
//                 //res.json(msg);
//                 // res.redirect('/')
//             })
//             .catch(err =>{
//                 res.json(err);
//             })
        
// } catch (error) {
//     var response = {
//       errors:error,
//       status: 400,
//       message: "Operation was not successful",
//     };

//     return res.status(400).send(response);
// }

// }



// using Cloudinary
async function Addpost(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        // console.log(data);
        
        let user = await User.findById(user_id)
        if(!user){
            var response = {
                status: 201,
                message: "No User Found Login first",
              };
            return res.status(201).send(response);
        }

        const {type, caption, header, brand, online_available} = req.body;

        //console.log(req.files.length);

        //const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path, {

        // Video file
        // const myCloud =await cloudinary.v2.uploader.upload_large(req.files[0].path, {
        //     resource_type: "auto"});

        if(req.files[0].mimetype.substr(0,5)=="image")
        {
        if(req.files.length>1){
            var img = [];
            for(var b=0;b<req.files.length;b++){
                //console.log(req.files[b]);
                // const myCloud =await cloudinary.v2.uploader.upload(req.files[b].path,
                //     {folder: "/POSTS"});

                // var datas = {
                //     public_id: myCloud.public_id,
                //     url: myCloud.secure_url,
                // }
                img.push(req.files[b].filename);
            }

            let sub = [];
            if(req.body.subcategory){

                //console.log(typeof req.body.subcategory);
                  if(req.body.subcategory.length == 24){
                    sub.push(req.body.subcategory)
                  }
                  else{
                       for(var b=0; b<req.body.subcategory.length;b++){
                            sub.push(req.body.subcategory[b])
                       }
                  }
            }

            const newPostData = {
                header:header,
                caption: caption,
                brand:brand,
                online_available:online_available,
                type:type,
                images: img,
                user: user_id,
                like_count:req.body.like_count,
                comment_icon:req.body.comment_icon,
                subcategory:sub
            };

            const post = await Post.create(newPostData);
        
            var response = {
                status: 200,
                data: post,
                message: "Post Added Successfully",
            };
            return res.status(200).send(newPostData);

        }
        else {
        // const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path,
        //     {folder: "/POSTS"});
            let sub = [];
            if(req.body.subcategory){

                //console.log(typeof req.body.subcategory);
                  if(req.body.subcategory.length == 24){
                    sub.push(req.body.subcategory)
                  }
                  else{
                       for(var b=0; b<req.body.subcategory.length;b++){
                            sub.push(req.body.subcategory[b])
                       }
                  }
            }

            const newPostData = {
                header:header,
                caption: caption,
                brand:brand,
                online_available:online_available,
                type:type,
                //images: req.files[0].filename,
                user: user_id,
                like_count:req.body.like_count,
                comment_icon:req.body.comment_icon,
                subcategory:sub
            };

            const post = await Post(newPostData);
            post.images.push(req.files[0].filename)
            await post.save();

            var response = {
                status: 200,
                data: post,
                message: "Post Added Successfully",
            };
            return res.status(200).send(response);
        }

        } else {
        // const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path,
        //     {folder: "/POSTS",
        //     resource_type: "video", 
        //     //public_id: "myfolder/mysubfolder/dog_closeup",
        //     chunk_size: 6000000,
        //     eager: [
        //       { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
        //       { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
        //     eager_async: true,
        //     //eager_notification_url: "https://mysite.example.com/notify_endpoint" });
        //     });
            let sub = [];
            if(req.body.subcategory){

                //console.log(typeof req.body.subcategory);
                  if(req.body.subcategory.length == 24){
                    sub.push(req.body.subcategory)
                  }
                  else{
                       for(var b=0; b<req.body.subcategory.length;b++){
                            sub.push(req.body.subcategory[b])
                       }
                  }
            }

            const newPostData = {
                header:header,
                caption: caption,
                brand:brand,
                online_available:online_available,
                type:type,
                // images: {
                //   public_id: myCloud.public_id,
                //   url: myCloud.secure_url,
                // },
                user: user_id,
                like_count:req.body.like_count,
                comment_icon:req.body.comment_icon,
                subcategory:sub
            };

            const post = await Post(newPostData);
            post.images.push(req.files[0].filename)
            await post.save();

            var response = {
                status: 200,
                data: post,
                message: "Post Added Successfully",
            };
            return res.status(200).send(response);
        }
        
} catch (error) {
    var response = {
      errors:error,
      status: 400,
      message: "Operation was not successful",
    };

    return res.status(400).send(response);
}

}


async function GetAllPost(req,res){
    try{
        const post = await Post.find(req.query).populate({path:"likes",select: ['email','username','images']})
                                               .populate({path:"comments.user",select: ['email','username','images']})
                                               .populate({path:"user",select: ['email','username','images','role']})
                                               .populate({path:"subcategory",select: ['name','image']})
                                               .sort({createdAt: -1})

        if(post){
            var response = {
                status: 200,
                data: post,
                message: 'successfull',
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Post Found",
              };
            return res.status(201).send(response);
        }
    } catch (error) {
        var response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function GetPost(req,res){
    try{
        const post = await Post.findById(req.params.id).populate({path:"likes",select: ['email','username']})
                                                       .populate({path:"comments.user",select: ['email','username']})
                                                       .populate({path:"user",select: ['email','username','images']})
                                                       .populate({path:"subcategory",select: ['name','image']})

        if(post){
            var response = {
                status: 200,
                data: post,
                message: 'successfull',
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Post Found",
              };
            return res.status(201).send(response);
        }
    } catch (error) {
        var response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


async function DeletePost(req,res){
    try{

        const post = await Post.findById(req.params.id)
        
        if(post){
            //await Post.remove()
            Post.findByIdAndDelete(req.params.id,(err, docs)=> {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                    messages: "Post delete failed",
                  };
                  return res.status(201).send(response);
                } else {
                    var response = {
                        status: 200,
                        message:"Post removed successfully",
                        data:docs,
                    };
                  return res.status(200).send(response);
                }
              });
        } else{
            var response = {
                status: 201,
                message: "No Post Found",
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


async function UpdatePost(req,res){
    try{
        if(req.params.id != ""){

            const {header, caption,online_available,brand} = req.body;

            const post = await Post.findById(req.params.id)
        
            if(post){
                const data = {
                    caption:caption,
                    header:header,
                    online_available:online_available,
                    brand:brand
                }
                Post.findByIdAndUpdate(req.params.id,{$set:data},{new:true},(err, docs)=> {
                    if (err) {
                      var response = {
                        status: 201,
                        message: err,
                      };
                      return res.status(201).send(response);
                    } else {
                        var response = {
                            status: 200,
                            message:"Post Updated successfully",
                            data:docs,
                          };
                          return res.status(200).send(response);
                    }
                  });
            } else{
                var response = {
                    status: 201,
                    message: "No Post Found",
                  };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: "Enter Post id",
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


// Post Likes
async function Likes(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        // console.log(data);

        const post = await Post.findById(req.params.id);
        const user = await User.findById(user_id)
        //console.log(post);

        if(post){
            const owner = await User.findById(post.user)
            //console.log(owner);
            var isLiked = false;

            // console.log(post.likes.length);
            for (var a = 0; a < post.likes.length; a++) {
                var liker = post.likes[a];

                if (liker == user_id) {
                    isLiked = true;
                    break;
                }
            }
            // console.log(isLiked);
            if(isLiked){
                post.likes.pull(user_id)
                await post.save();

                        // Unlike so Delete Notification
                        const data = await Notification.aggregate([{$match:{
                                                                      $and:[
                                                                          {'owner':owner._id, 'user':user._id,"post_id":post._id},
                                                                          {'type':"like"}
                                                                      ]
                                                                      }
                                                                      }])

                        //console.log(data);
                        await Notification.findByIdAndDelete(data[0]._id,{new:true});

                var response = {
                    status: 200,
                    message: 'Post has been Disliked.',
                    data: post,
                  };
                  return res.status(200).send(response);
            }
            else {
                post.likes.push(user_id)
                await post.save();
                
                if(user.role == "USER"){
                    var not = {
                      owner:owner._id,
                      user:user._id,
                      post_id:post._id,
                      message: `${user.username} Like ur Post.`,
                      type:"like",
                    }
                    await Notification.create(not)
                  } else {
                    var not = {
                      owner:owner._id,
                      user:user._id,
                      post_id:post._id,
                      message: `${user.name} Like ur Post.`,
                      type:"like",
                    }
                    await Notification.create(not)
                }

                var response = {
                    status: 200,
                    message: 'Post has been liked.', 
                    data: post,
                  };
                  return res.status(200).send(response);
            }
            
        } else{
            var response = {
                status: 201,
                message: "No Post Found",
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


// Post Comments
async function Comments(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        // console.log(data);

        const {comment} = req.body;

        const post = await Post.findById(req.params.id);
        const user = await User.findById(user_id)

        if(post){
            const owner = await User.findById(post.user)

            var datas ={
                comment: comment,
                user: user_id,
            }

            post.comments.push(datas);
            await post.save();

            if(user.role == "USER"){
                var not = {
                  owner:owner._id,
                  user:user._id,
                  post_id:post._id,
                  message: `${user.username} Comments on ur Post.`,
                  type:"comment",
                }
                await Notification.create(not)
              } else {
                var not = {
                  owner:owner._id,
                  user:user._id,
                  post_id:post._id,
                  message: `${user.name} Comments on ur Post.`,
                  type:"comment",
                }
                await Notification.create(not)
            }
            var response = {
                    status: 200,
                    message: `Post Commented`, 
                    data: post,
                };
            return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Post Found",
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


async function DeleteComments(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;

        const {comment_id} = req.body;

        const post = await Post.findById(req.params.id)
        const user = await User.findById(user_id)


        if(post.comments.length>0){

            const owner = await User.findById(post.user)

            post.comments.forEach(async(data)=>{
                // console.log(data._id);
                if(comment_id == data._id.toString())
                {
                    //post.comments.pull(datas);
                    post.comments.pull(data);
                    await post.save();

                    // Delete Comment so Delete Notification
                    const datas = await Notification.aggregate([{$match:{
                        $and:[
                            {'owner':owner._id, 'user':user._id,"post_id":post._id},
                            {'type':"comment"}
                        ]
                        }
                        }])

                    //console.log(data);
                    await Notification.findByIdAndDelete(datas[0]._id,{new:true});

                    var response = 
                        {
                              status: 200,
                              message:"Comment removed successfully",
                              comments : data,
                              data:post,
                        };
                    return res.status(200).send(response);
                }
            })
        } else {
            var response = {
                    status: 201,
                    message: "No Comments Found",
                  };
            return res.status(201).send(response);
        }

       // console.log(post.comments[0]._id.toString());
       // console.log(comment_id);
        
        
       
        // if(post){
        //     //await Post.remove()
        //     Post.findByIdAndDelete(req.params.id,(err, docs)=> {
        //         if (err) {
        //           var response = {
        //             status: 201,
        //             message: err,
        //             messages: "Comment delete failed",
        //           };
        //           return res.status(201).send(response);
        //         } else {
        //             var response = {
        //                 status: 200,
        //                 message:"Comment removed successfully",
        //                 data:docs,
        //             };
        //           return res.status(200).send(response);
        //         }
        //       });
        // } else{
        //     var response = {
        //         status: 201,
        //         message: "No Comment Found",
        //       };
        //     return res.status(201).send(response);
        // }

    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
    
        return res.status(400).send(response);
    }
}


//Only Following users Post
async function FollowingPost(req,res){
    try{
        const todayDate = getFormattedDate();
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        
        response = {
            status: 200,
            message: 'Post Commented', 
            time: time,
            todayDate: todayDate,
        };
        return res.status(400).send(response);
        
    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
        return res.status(400).send(response);
    }
}


async function GetPostImage(req,res){
    try{
        res.download("./uploads/Post/"+req.params.file);
    } catch (error) {
        response = {
          errors:error,
          status: 400,
          message: "Operation was not successful",
        };
        return res.status(400).send(response);
    }
}



module.exports ={
    Addpost,
    GetAllPost,
    GetPost,
    DeletePost,
    UpdatePost,
    Likes,
    Comments,
    DeleteComments,
    FollowingPost,
    GetPostImage,
};


function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
}