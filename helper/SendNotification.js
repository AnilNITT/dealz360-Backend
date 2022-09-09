var https = require('https');

const sendNotification = async(req,res) =>{

        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic YzNmMWY4N2MtMWYxMy00ZmZlLWIzOTYtMzgzNjg5YzM0Y2Q5"
        };
        
        var data = { 
            // app_id: "5eb5a37e-b458-11e3-ac11-000c2940e62c",
            app_id: "7d24b8b9-bdcc-4b37-81b2-e6cc6d6a7f87",
            contents: {"en": "English Message"},
            headings: {"en": "New Like"},
            channel_for_external_user_ids: "push",
            include_external_user_ids: ["62c80613d2f2f7c89e3538fc"]
          };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "https://onesignal.com/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        

        
        var reqq = https.request(options, function(ress) {  
          ress.on('data', function(data) {
            //console.log("Response:");
            //console.log(JSON.parse(data));
            res.send(JSON.parse(data))
          });
        });
        
        reqq.on('error', function(e) {
          res.json(e);
          //console.log("ERROR:");
          //console.log(e);
        });
        
        reqq.write(JSON.stringify(data));
        reqq.end();
      };


module.exports = {sendNotification}