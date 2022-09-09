const User = require("../models/User");
const jwt_decode = require("jwt-decode");
const Story = require("../models/Story");
const cloudinary = require("cloudinary");

// Add Story
async function AddStory(req,res){
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
    
        let user = await User.findById(user_id)

        if(!user){
            var response = {
                status: 201,
                message: "No User Found Login first",
              };
            return res.status(201).send(response);
        }
        if(req.files.length ===0){
          var response = {
              status: 201,
              message: "Select a story Image/Video file",
            };
          return res.status(201).send(response);
        }
        const { caption} = req.body;

        //console.log(req.files);
        //console.log(typeof images);
        if(req.files[0].mimetype.substr(0,5)=="image")
        {
        // const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path, {
        //     folder: "/STORY",
        // });
        //console.log(myCloud);

            let img = [{
              name: req.files[0].filename,
              time: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
            }]
            //console.log(myCloud);
            const newPostData = {
                caption: caption,
                images: img,
                user: user_id,
                storytype:"image"
            };

            const story = await Story.create(newPostData);
            user.story.push(story._id);
            await user.save();

            var response = {
                status: 200,
                data: story,
                message: "Story Added Successfully",
            };
            return res.status(200).send(response);
        } else {
          //   const myCloud =await cloudinary.v2.uploader.upload(req.files[0].path, {
          //     folder: "/STORY",
          //     resource_type: "video", 
          //     //public_id: "myfolder/mysubfolder/dog_closeup",
          //     chunk_size: 6000000,
          //     eager: [
          //       { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
          //       { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
          //     eager_async: true,
          //     //eager_notification_url: "https://mysite.example.com/notify_endpoint" 
          // });
              let img = [{
                name: req.files[0].filename,
                time: new Date(Date.now() + (-1*new Date().getTimezoneOffset()*60000)).toISOString(),
              }]

              const newPostData = {
                  caption: caption,
                  images: img,
                  user: user_id,
                  storytype:"video"

              };
  
              const story = await Story.create(newPostData);
              user.story.push(story._id);
              await user.save();
  
              var response = {
                  status: 200,
                  data: story,
                  message: "Story Added Successfully",
              };
              return res.status(200).send(response);
        }
    
}

// get all user Story
async function GetAllStory(req,res){
    try{

        // const story = await Story.find(req.query).populate({path:"user",select: ['email','username','images']})
        //                                          .populate({path:"seen_by",select: ['email','username','images']})
        //                                          .sort({createdAt: -1})
        
        const story = await Story.aggregate([
          //{"$match" : {"createdAt":{"$gt":new Date(Date.now() - 24*60*60 * 1000)}}},
          {"$sort":{"createdAt":-1,"user":1,}},
        ]);
        
        //await User.populate(story,{path: "user",select: ['name','username', 'email','images']})
        if(story && story.length>0){
          let arr = [];
          let abc = [];
          let count = 0;
          const lengt = story.length;
          story.forEach(async(data)=>{
            //console.log(data.user);
            if(!abc.includes(data.user.toString())){
                abc.push(data.user.toString())
                //console.log(abc);
                story.forEach(async(datas)=>{
                  if(data.user.toString()===datas.user.toString()){
                    arr.push(datas)
                    count++;
                  }
                })
                if(count===lengt){

                  await User.populate(arr,{path: "user",select: ['name','username', 'email','images']})

                  var response = {
                    status: 200,
                    message: 'successfull',
                    data: arr,
                  };
                  return res.status(200).send(response);
                }
            }
          })
        } else{
            var response = {
                status: 201,
                message: "No Story Found",
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

// get Single Story
async function GetStory(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        //console.log(user_id);

        const story = await Story.findById(req.params.id).populate({path:"user",select: ['email','username','images']})
                                                         .populate({path:"seen_by",select: ['email','username','images']});

        const user = await User.findById(story.user._id);

        //console.log(user._id.toString());
        if(user_id != user._id.toString()){
            if(story.seen_by.length < 1){
              story.seen_by.push(user_id)
              story.save();
            } else {
            var count=0;
            story.seen_by.forEach((data)=>{
              //console.log(user_id);
              //console.log(data.toString());
                  if(user_id == data._id.toString()){
                    count =1;
                  }
            })
            console.log(count);
            if(count ==0){
              story.seen_by.push(user_id)
              story.save();
            }
          }
        }
        if(story){
            var response = {
                status: 200,
                message: 'successfull',
                data: story,
              };
              return res.status(200).send(response);
        } else{
            var response = {
                status: 201,
                message: "No Story Found",
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

// Delete Story
async function DeleteStory(req,res){
    try{

        const story = await Story.findById(req.params.id)
        
        if(story){
            //await Post.remove()
            Story.findByIdAndDelete(req.params.id,(err, docs)=> {
                if (err) {
                  var response = {
                    status: 201,
                    message: err,
                    messages: "Story delete failed",
                  };
                  return res.status(201).send(response);
                } else {
                    var response = {
                        status: 200,
                        message:"Story removed successfully",
                        data:docs,
                    };
                  return res.status(200).send(response);
                }
              });
        } else{
            var response = {
                status: 201,
                message: "No Story Found",
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

// Make story as Highlight
async function UpdateStory(req,res){
  try{
      
    const story = await Story.findById(req.params.id)

    if(story){
          //await Post.remove()
          const data = {
            type:"Highlight"
          };

          Story.findByIdAndUpdate(
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
                  message: "Story Added to HighLights",
                  data: docs,
                };
                return res.status(200).send(response);
              }
            }
          )
      } else{
          var response = {
              status: 201,
              message: "No Story Found",
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

// Get Following user Story
async function GetFollowingStory(req,res){
  try{

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    //console.log(user_id);

    const user = await User.findById(user_id);

    if(!user) {
      var response = {
        status: 201,
        message: "No User Found... Login First",
      };
      return res.status(201).send(response);
    }
      // const story = await Story.find(req.query).populate({path:"user",select: ['email','username','images']})
      //                                          .populate({path:"seen_by",select: ['email','username','images']})
      //                                          .sort({createdAt: -1})
      
      const story = await Story.aggregate([
        {"$match" : {"createdAt":{"$gt":new Date(Date.now() - 24*60*60 * 1000)}}},
        {"$sort":{"createdAt":-1,"user":1,}},
      ]);
      
      //await User.populate(story,{path: "user",select: ['name','username', 'email','images']})
      if(user.following.length>0){
      if(story && story.length>0){
        let jkl = [];
        let mno = [];
        let arr = [];
        let abc = [];
        let count = 0;
        const lengt = story.length;
        story.forEach(async(data)=>{
          if(user.following.includes(data.user)){
            if(!abc.includes(data.user.toString())){
              abc.push(data.user.toString())
              const dataz = {
                user : data.user,
                story : mno,
              }
              jkl.push(dataz)
              console.log(jkl);
              //console.log(abc);
              story.forEach(async(datas)=>{
                if(data.user.toString()===datas.user.toString()){
                  jkl[0].story.push(datas)
                  arr.push(datas)
                  count++;
                }
              })
          }
          } else {
            count++;
          }
          if(count===lengt){
                await User.populate(jkl,{path: "user",select: ['name','username', 'email','images']})
                
                var response = {
                    status: 200,
                    message: 'successfull',
                    //data: arr,
                    data:jkl
                  };
                return res.status(200).send(response);
          }
        })
      } else{
          var response = {
              status: 201,
              message: "No Story Found",
            };
          return res.status(201).send(response);
      }
    } else{
      var response = {
          status: 201,
          message: "No Story Found",
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

// get user story
async function GetUserStory(req,res){
  try{

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    //console.log(user_id);

    const user = await User.findById(user_id);

    if(!user) {
      var response = {
        status: 201,
        message: "No User Found... Login First",
      };
      return res.status(201).send(response);
    }
      // const story = await Story.find(req.query).populate({path:"user",select: ['email','username','images']})
      //                                          .populate({path:"seen_by",select: ['email','username','images']})
      //                                          .sort({createdAt: -1})
      
      const story = await Story.aggregate([
                                          {"$match" : {
                                            $and:[
                                              {"createdAt":{"$gt":new Date(Date.now() - 24*60*60 * 1000)}},
                                              {"user":user._id,}
                                           ]
                                          }},
                                          {"$sort":{"createdAt":-1}},
                                        ])
      
      if(story && story.length>0){

        await User.populate(story,{path: "user",select: ['name','username', 'email','images']})

        var response = {
          status: 200,
          message: 'successfull',
          data:story
        };
      return res.status(200).send(response);
      } else{
          var response = {
              status: 201,
              message: "No Story Found",
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

// get user Highlight Story
async function GetHighlightStory(req,res){
  try{

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    //console.log(user_id);

    const user = await User.findById(user_id);

    if(!user) {
      var response = {
        status: 201,
        message: "No User Found... Login First",
      };
      return res.status(201).send(response);
      }
      const story = await Story.find({user:user._id,type:"Highlight"}).populate({path:"user",select: ['email','username','images']})
                                               .populate({path:"seen_by",select: ['email','username','images']})
                                               .sort({createdAt: -1})
      
      if(story && story.length>0){

        //await User.populate(story,{path: "user",select: ['name','username', 'email','images']})
        var response = {
          status: 200,
          message: 'successfull',
          data:story
      };
      return res.status(200).send(response);
      } else{
          var response = {
              status: 201,
              message: "No Story Found",
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


module.exports = {
    AddStory,
    GetAllStory,
    GetStory,
    DeleteStory,
    UpdateStory,
    GetFollowingStory,
    GetUserStory,
    GetHighlightStory,
}


function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();

  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();

  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
}