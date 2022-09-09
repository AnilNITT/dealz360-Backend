var router = require("express").Router();
var multer = require('multer');
var fs = require("fs-extra");
var path = require('path');
const {
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
} = require("../controller/post")

// set storage
const storage = multer.diskStorage({
    destination : function ( req , file , callback ){
        var path = `./uploads`;
        fs.mkdirsSync(path);
        //callback(null, 'uploads')
        callback(null, path);
    },
    filename : function (req, file , callback){
        // image.jpg
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        return callback(null, file.fieldname + '-' + Date.now() + ext)
        //callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        //callback(null, file.originalname)
        // save file as original name
        // callback(null, file.originalname + ext)
    }
})
const upload = multer({ 
    storage : storage,
    limits: {
        fileSize: 20*1048576,  // 20MB
    }
 })


// for single image post
//router.post("/add",upload.single("profile"),Addpost);

// for multiple images or video
router.post("/add",upload.array("images",10),Addpost);
// router.post("/add",Addpost);
router.get("/getall",GetAllPost);
router.get("/get/:id",GetPost);
router.delete("/delete/:id",DeletePost);
router.patch("/update/:id",UpdatePost);

// Posts Likes route
router.post("/likes/:id",Likes);

// Posts Comments route
router.post("/comments/:id",Comments);
router.delete("/deletecomment/:id",DeleteComments);

// User Following Posts
router.get("/following_post",FollowingPost);

router.get("/getpostimage/:file",GetPostImage);

module.exports = router