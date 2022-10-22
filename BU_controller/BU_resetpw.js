
const crypto = require('crypto')

// IMPORT BCRYPTJS MODULE
// FOR PASSWORD ENCRYPTION
const bcrypt = require('bcryptjs')

const path = require('path')
const mongodb = require('mongodb')
const User = require('../model/user.js')

// BELOW IS FOR TPYE-MATCHING
const ObjectId = mongodb.ObjectId


// IMPORT NODE MAILER
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.NODEMAILER_API_KEY
  }
}))





// < RENEW PASSWORD >
exports.getRenewPass = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('resetpw.js ::  REQUEST-GET TO RENEW PASSWORD PAGE!')
  console.log(req.session)

  // -------------------------------------------------------
  // GETTING TOKEN FROM VIEW
  // #### TOKEN IS EMBEDED IN THE URL !!!!
  // SO WE RETRIEVE THAT
  console.log('resetpw.js ::  req.params IS ---  ')
  console.log(req.params)
  const token = req.params.token


  // < resetTokenExpiration SHOULD BE COMPARED >
  // TODO !!!!


  // < FIND THE USER BY TOKEN >
  //
  // < $gt :: GREATER THAN ---- >
  // :: SO IT FILTERS THE FUTURE!
  //
  User.findByToken({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then( user => {

      let err_message = req.flash('error')
      if(err_message.length > 0) {
        err_message = err_message[0]          // BECAUSE message IS AN ARRAY !
      } else {
        err_message = null
      }

      // AND WE WILL SEND TO VIEW
      // 'WITH THE PROPER INFORMATION'
      res.render('resetpw-new.ejs', {
        errorMessage: err_message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      console.log(err)
    })

}




// < POSTING RENEW PASSWORD PAGE >
exports.postRenewPass = (req, res, next ) => {
  console.log('----------------------------------------------')
  console.log('%% resetpw.js ::  REQUEST-POST TO RENEW PASSWORD!')
  console.log('BELOW IS req.body SENT FROM USER FORM')
  console.log(req.body)


  // ---------------------------------------
  // < RESETTING PASSWORD >
  const newPassword = req.body.userPass
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken

  // ---------------------------------------
  // FOR SCOPE TO INSIDE OF BELOW FUNCTION      VV
  // BELOW 3 ARE SAME AS ORIGINAL
  let resettingUser;

  let userName;
  let userEmail;
  let userMathNode;


  User.findByToken({resetToken: passwordToken,
                    resetTokenExpiration: {$gt: Date.now()}
    })
    .then(user => {
      console.log('%% resetpw.js findByToken2() :: LOG user...')
      console.log(user)

      // SAVE HERE TO GO OVER THE NEXT then() BLOCK
      userName = user.name
      userEmail = user.email


      // SO FAR, WE FOUND THE USER TO UPDATE PASSWORD
      //
      // FIRST, WE ENCRYPT THE 'INPUTTED NEW PASSWORD'
      return bcrypt.hash( newPassword, 12)
    })
    .then( hashedPassword => {

      // MAKING STRING VALUE ID TO ObjectID
      const id = new ObjectId(userId)

      // CREATING NEW USER WITH UPDATED VALUES
      resettingUser = new User(userName, userEmail, hashedPassword, userMathNode, id)

      // UPDATE THE DOCUMENT
      return resettingUser.update()
    })
    .then( result => {
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err)
    })

}






// < SHOWING RESET PASS PAGE >
exports.getResetPass = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('resetpw.js ::  REQUEST-GET TO RESET PASSWORD PAGE!')
  console.log(req.session)

  // SEND RENDERED PAGE TO CLIENT
  // WITH FLASH MESSAGE !
  //
  // < ABOUT FLASH MESSAGE >
  // THE FLASH MESSAGE IS REGISTERED BELOW AND SEND TO THE CLIENT FROM HERE
  //
  // #### THIS MESSAGE 'WILL BE DELETED' FROM SESSION !!!! ####
  //
  let err_message = req.flash('error')

  if(err_message.length > 0) {
    err_message = err_message[0]          // BECAUSE message IS AN ARRAY !
  } else {
    err_message = null
  }

  res.render('resetpw.ejs', {errorMessage: err_message})

}



// < POSTING EMAIL REQUEST >
exports.postResetPass = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('%% resetpw.js ::  REQUEST-POST TO EXECUTE RESET PASSWORD!')
  console.log('BELOW IS req.body SENT FROM USER FORM')
  console.log(req.body)


  // ---------------------------------------
  // < RESETTING PASSWORD >

  // ---------------------------------------
  // < GENERATING RANDOM VALUE FOR EMBED TO EMAIL >
  crypto.randomBytes(32, (err, buffer) => {
    // FIRST ERROR HANDLING FOR GENERATING BYTES
    if( err ) {
      console.log('%% resetpw.js :: ERROR OCCURED TO GENERATE RANDOM BYTES')
      return res.redirect('/resetpass')
    }

    // CONVERTING GENERATED TOKEN
    // TO HEXADEMICAL
    const token = buffer.toString('hex')


    // ---------------------------------------
    // GETTING EMAIL FROM REQUEST
    const email = req.body.userEmail


    // ---------------------------------------
    // < CHECK INPUTTED EMAIL IS ALREADY EXIST IN DATABASE >
    User.findByEmail(email)
      .then( user => {
        console.log('%% resetpw.js ::  UNIQUENESS CHECK --   ')
        console.log(user)

        if (!user) {
          // IF THERE IS NO MATCH, IT MEANS THE USER DOES NOT HAVE ACCOUNT

          // DISPLAY WARNING MESSAGE

          // < SENDING MESSAGE USING FLASH >
          //
          req.flash('error', 'EMAIL ADDRESS DOES NOT EXIST !')

          return res.redirect('/resetpass')

        } else {



          // < USER IS FOUND >
          // IF THERE IS USER,
          // WE NEED TO SEND EMAIL TO USER

          // BEFORE THAT, WE WANT TO INSERT THE TOKEN TO USER AND SAVE
          console.log("%% resetpw.js ::  GENERATED TOKEN IS..." + token)


          const tokenData = {
            resetToken: token,
            resetTokenExpiration: Date.now() + 3600000
          }

          //user.resetToken = token
          //user.resetTokenExpiration = Date.now() + 3600000

          // CREATING TEMP NEW USER
          //const newid = ObjectId();
          //const newName = user.name + '_pending'

          const temp_new_user = new User(user.name,
                                         user.email,
                                         user.pass,
                                         user._id)

          //temp_new_user.resetToken = user.resetToken
          //temp_new_user.resetTokenExpiration = user.resetTokenExpiration




          // // CREATING TEMP NEW USER
          // const newid = ObjectId();
          // const newName = user.name + '_pending'
          //
          // const temp_new_user = new User(newName,
          //                                user.email,
          //                                user.pass,
          //                                newid)
          //
          // temp_new_user.resetToken = user.resetToken
          // temp_new_user.resetTokenExpiration = user.resetTokenExpiration




          return temp_new_user.updateToken(tokenData)


        }



      })
      .then(result => {

        // BELOW PROCESS SHOULD BE EXECUTED
        // ONLY IF result IS RETURNED FROM User.save() METHOD
        //
        // SO IF THE result IS BOOLEAN, IT MEANS THAT
        // THERE WAS NO MATCHED EMAIL ADDRESS

        if( result != undefined ) {

          console.log('%% resetpw.js ::  AFTER TOKEN GENERATED AND NEW USER CREATED...   ')
          console.log('%% resetpw.js ::  PRINTING result BELOW...')
          console.log(result)

          // AFTER TEMP USER CREATED,
          // FIND USER WITH INSERTED ID
          User.findById(result.insertedId)
            .then( user => {

              res.redirect('/')

              // ---------------------------------------------
              // < MAILING >
              transporter.sendMail({
                to: email,
                from: 'gounbeee@gmail.com',
                subject: 'RAMAA APP :: RESETTING PASSWORD',
                html: `<h1>YOU ARE RECIEVED EMAIL FOR RESETTING PASSWORD</h1>
                       <p>You requested a password reset</p>
                       <p>Click this <a href="http://localhost:3333/reset/${token}">link</a> to set a new password.</p>
                `
              })

            })
            .catch( err => {
              console.log(err)
            })

        }


      })
      .catch( err => {
        console.log(err)
      })
  })


}
