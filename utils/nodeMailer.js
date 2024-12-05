const nodeMailer = require("nodemailer");



const transporter = nodeMailer.createTransport({

    service:"gmail",
    secure:false,
    auth :{
        user: "wanifiras7@gmail.com",
        pass:  "nphu flck uijt bact",
    },
});


module.exports=transporter