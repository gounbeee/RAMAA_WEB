const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Token = require("../models/tokenModel");


module.exports = async (user, mailType) => {

  try {

    // < OPTIONS FOR NODEMAILER >
    // DEFINE WHO SENDS EMAIL TO TARGET USER
    // 
    // **** NOW, WE HAVE TO 2-STEP CERTIFICATION WITH GMAIL ! ****
    //
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,              //  **   CHANGE To true !!!!!!
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD_GMAIL_SENDER,
      },
      tls: {
        rejectUnauthorized: false
      }

    });


    // WE ENCRYPT USER'S ID LIKE 6350fcf705f9d7d474bc5f70 IN MONGO DB
    const encryptedToken = bcrypt
      .hashSync(user._id.toString(), 10)
      .replaceAll("/", "");


    // CONSTRUCTING FINAL token
    const token = new Token({
      userid: user._id,
      token: encryptedToken,
    });

    // SAVE THE TOKEN TO DATABASE
    // THEN AFTER USER CLICKED THE LINK IN THEIR EMAIL,
    // WE WILL VERIFY IT
    await token.save();


    // -----------------------------------------------------------
    // STYLING EMAIL
    //
    let emailContent, mailOptions;


    if (mailType == "emailverify") {

      emailContent = `<div>
                        <h3>
                        Hi!<br><br>
                        Thank you for creating account with our homepage!<br>
                        Gounbeee.com is a litte place to study something.<br><br>
                        And, you can use the place for your use!<br>
                        You can export your own layout to json file, and then import later.<br><br>
                        This homepage is maintained by personally, but is developing new functionalities step by step.<br><br>
                        To activate homepage, please click on the below link to verify your email address.<br>
                        </h3>
                        <a href="http://localhost:3000/emailverify/${encryptedToken}">http://localhost:3000/emailverify/${encryptedToken}</a>  
                        <h3>
                        <br>
                        Have a fun!
                        <br>
                        <br>
                        <br>
                        Gounbeee.com<br>
                        </h3>
                      </div>`;


      mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: "Please Verify Your Email for using Gounbeee.com",
        html: emailContent,
      };


    } else {

      // OTHER SCENARIO IS FOR RESETTING PASSWORD

      emailContent = `<div>
                        <h3>
                        Hi!<br><br>
                        You clicked reset password button in Gounbeee.com<br>
                        </h3>
                        <h3>Please click on the below link to reset your password !</h3>
                        <br>
                        <a href="http://localhost:3000/passwordreset/${encryptedToken}">http://localhost:3000/passwordreset/${encryptedToken}</a>  
                        <br><br><br>
                        <h3>Gounbeee.com</h3>
                        <br><br>
                      </div>`;


      // OPTIONS FOR NODE MAILER
      mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: "Reset password for Gounbeee.com",
        html: emailContent,
      };


    }

    // SENDING EMAIL
    await transporter.sendMail(mailOptions);


  } catch (error) {


    console.log(error);

    
  }
};
