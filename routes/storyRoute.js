const router = require("express").Router();
const { AddStory,
        GetAllStory,
        GetStory,
        DeleteStory,
        UpdateStory,
        GetFollowingStory,
        GetUserStory,
        GetHighlightStory,
        GetDiscountStory,
        } = require("../controller/story");

var multer = require('multer');
var fs = require("fs-extra");


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
        // callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        //callback(null, file.originalname)
        // save file as original name
        // callback(null, file.originalname + ext)
    }
})
const upload = multer({ 
    storage : storage,
    limits: {
        fileSize: 25*1048576,  // 25MB
    }
 })

router.post("/add",upload.array("images",10),AddStory);

//router.post("/add",AddStory);
router.get("/getall",GetAllStory);
router.get("/get/:id",GetStory);
router.delete("/delete/:id",DeleteStory);
router.put("/update/:id",UpdateStory);

// Only Following user Story
router.get("/getallfollowing",GetFollowingStory);

// Only Discount Following user Story
router.get("/getalldiscount",GetDiscountStory);

// Single User story
router.get("/mystory",GetUserStory);

// user highlight
router.get("/myhighlightstory",GetHighlightStory);


module.exports = router
