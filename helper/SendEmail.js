const nodemailer = require("nodemailer");

const sendEmail = async(email,name,subject, text) =>{
    try{
        let client = nodemailer.createTransport({
            // service: 'gmail',
            pool: true,
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: 'patidaranil0791@gmail.com',
                pass: 'tgpilpnhzyoqkmie'
            }
           
        });
        let mailContent = {
            from: {
                name: 'Dealz360 Team',
                address: 'patidaranil0791@gmail.com'
            },
            to: email,
            subject: subject,
            text: text,
            html: `<h2>Hello ${name}</h1>
            <br/>
            <h3>Your account password is</h3>
            <h3>${text}</h3>
            <h4>'This is Your New Password.</h4>'
            'Thanks,Dealz360 Team. '` // the tick should come here
        };
        const data = await client.sendMail(mailContent)
        return data
        //return email
    } catch(error){
        return {error,message:"email not sent"};
    }
}


module.exports = {sendEmail}