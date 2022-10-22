
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


const fs = require('fs')



// < SHOWING SIGNUP PAGE >
exports.getShowSignup = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('signup.js ::  REQUEST-GET TO SHOW SIGNUP PAGE!')
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

  res.render('signup.ejs', {errorMessage: err_message})

}


// WHEN USER PRESSED CREATE NEW ACCOUNT BUTTON !
exports.postShowSignup = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('%% signup.js ::  REQUEST-POST TO EXECUTE SIGNUP THE USER!')
  console.log('BELOW IS req.body SENT FROM USER FORM')
  console.log(req.body)

  // ---------------------------------------
  // < CREATING NEW USER >
  // WITH 'DEFAULT MATHNODE'
  //
  const name = req.body.userName
  const email = req.body.userEmail
  const pass = req.body.userPass
  const passConfirm = req.body.userPassConfirm
  // CURRENTLY ROLE SETTING IS MANUALLY SETTED
  const role = 'GUEST'

  // ONLY IF ENTERED PASSWORD AND CONFIRMED PASSWORD WERE SAME
  // WE CAN GO NEXT PROCESS
  if ( pass === passConfirm ) {

    // ---------------------------------------
    // < CHECK INPUTTED EMAIL IS ALREADY EXIST IN DATABASE >
    User.findByEmail(email)
      .then( user => {
        console.log('%% signup.js ::  UNIQUENESS CHECK --   ')
        console.log(user)

        if (user) {
          // THERE IS SAME email USER !
          // SO WE NEED TO REDIRECT TO SAME PAGE AND
          // DISPLAY SOME WARNING MESSAGE !

          // DISPLAY WARNING MESSAGE

          // < SENDING MESSAGE USING FLASH >
          //
          req.flash('error', 'Your input is not valid. Maybe you already signed up in the past.')

          return res.redirect('/signup')
        }


        // IF THERE IS NO EMAIL, CREATE NEW USER !


        // ---------------------------------------------
        // < ENCRYPT OUR USER'S PASSWORD >
        // hash FUNCTION RETURNS HASHED VALUE
        // BUT #### THE FUNCTION IS ASYNCHRONOUS!
        return bcrypt
          .hash(pass, 12)
          .then(hashedPassword => {

            // ---------------------------------------------
            // < GENERATING NEW UNIQUE ObjectId >
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            //
            // To generate a new ObjectId,
            // use ObjectId() with no argument
            const newid = ObjectId();

            const new_user = new User(name, email, hashedPassword, role, newid)

            // NEW USER CREATED
            // CREATED TO DATABASE
            return new_user.save()
          })
          .then( result => {



            // ---------------------------------------------
            // save() FUNCTION ABOVE USES inserOne() INTERNALLY,
            // SO IT RETURNS { acknowledged : OOO , insertedId: OOO}
            console.log("%% signup.js :: NEW ACCOUNT CREATED !!!!!")


            // < AUTOMATIC LOGIN >
            //
            // AFTER SAVING NEW USER, THEN LOG IN THAT USER AUTOMATICALLY
            //
            console.log("%% signup.js :: AUTOMATIC LOGIN")

            User.findById(result.insertedId)
              .then(user => {



                // ---------------------------------------------
                // CREATE USER FOLDER
                // https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
                let newDirName = user.email
                const midPath = '../userData/' + newDirName
                const finalPath = path.join(__dirname, midPath)
                if (!fs.existsSync(finalPath)){
                  fs.mkdirSync(finalPath, { recursive: true });
                }


                // ---------------------------------------------
                // SETTING SESSION NEW USER
                // AND HE OR SHE SHOULD BE LOGGED IN
                req.session.loginFlag = true
                req.session.user = user
                req.session.role = user.role

                console.log(req.session)


                // SAVING SESSION
                req.session.save( err => {
                  if(err) {
                    console.log("%% signup.js :: ERROR OCCURED WHEN NEW LOGIN AFTER ACCOUNT CREATION")
                    console.log(err)
                  }
                })

                res.redirect('/')

                // ---------------------------------------------
                // < MAILING >
                transporter.sendMail({
                  to: user.email,
                  from: 'gounbeee@gmail.com',
                  subject: 'Thank you for Signing up.',
                  html: '<h1>Thank you for signing up our website!</h1><p>You can use additional slots to load your contents.</p>'
                })


              })

          })
          .catch( err => {
            console.log(err)
          })
      })

  } else {

    // IF ENTERED PASSWORD AND CONFIRM PASSWORD ARE DIFFRENT,
    // DISPLAY SOME WARNING MESSAGE

    // < SENDING MESSAGE USING FLASH >
    //
    req.flash('error', 'PASSWORD MISMATCHED !')

    console.log('%% signup.js :: PASSWORD AND CONFIRM PASSWORD ARE NOT MATCHED !!!!')
    res.redirect('/signup')

  }
}
