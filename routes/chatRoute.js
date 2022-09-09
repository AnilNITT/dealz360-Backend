const router = require("express").Router();
const  { SendMessage,
         GetAllChat,
         GetConversation,
         GetHistory,
         DeleteMessage,
         GetHistorymsg,
        } = require("../controller/chat");


router.post("/sendmessage/:id",SendMessage);
router.get("/getall",GetAllChat);
router.get("/getconversation",GetConversation);
router.get("/history",GetHistory);
router.delete("/deletemessage/:id",DeleteMessage);
router.get("/historymsg",GetHistorymsg);

module.exports = router;