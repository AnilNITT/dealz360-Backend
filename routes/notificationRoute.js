const router = require("express").Router();
const {GetAllNotification} = require("../controller/notification")
const {sendNotification} = require("../helper/SendNotification")




router.get("/getall",GetAllNotification);


router.post("/send",sendNotification);


module.exports = router;
