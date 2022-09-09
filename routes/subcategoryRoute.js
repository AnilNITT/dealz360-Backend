const router = require("express").Router();
var multer = require('multer');
var fs = require("fs-extra");
var path = require('path');
const {
    AddSubCategory, 
    GetAllSubCategory, 
    GetSubCategory, 
    DeleteSubCategory,
    UpdateSubCategory,
    } = require("../controller/subcategory");



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
            fileSize: 10*1048576,  // 10MB
        }
     })



router.post("/add",upload.array("image",10),AddSubCategory);
router.get("/getall",GetAllSubCategory);
router.get("/get/:id",GetSubCategory);
router.delete("/delete/:id",DeleteSubCategory);
router.patch("/update/:id",upload.array("image",10),UpdateSubCategory);


module.exports = router;