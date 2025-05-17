
import nodemailer from "nodemailer"

const createTransporter = () =>{
    return nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.MAIL,
            pass : process.env.APP_PASSWORD
        }
    })
}

const preparaOptions = (to,subject,text,html) =>{
    return {
        form : process.env.MAIL,
        to : to,
        subject : subject,
        text : text ,
        html : html
    }
}

const sendEMail =async (to,subject,text,html) =>{
    const transporter = createTransporter();
    const options = preparaOptions(to,subject,text,html);
  try {
    const info = await transporter.sendMail(options);
    console.log("email send", info.response);
    return info.response;
  } catch (error) {
    console.log("Error sending email:", error);
    return { success: false, error: error.message };
  }
}