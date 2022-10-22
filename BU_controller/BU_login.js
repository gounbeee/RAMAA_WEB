

// IMPORT BCRYPTJS MODULE
// FOR PASSWORD ENCRYPTION
const bcrypt = require('bcryptjs')


const path = require('path')
const User = require('../model/user.js')






// < SHOWING LOGIN PAGE >
// #### IF USER SEES THIS PAGE, THAT MEANS
//      USER IS 'NOT' AUTHENTICATED !!
exports.getShowLogin = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('login.js ::  REQUEST-GET TO SHOW LOGIN PAGE!')
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

  res.render('login.ejs', {errorMessage: err_message})

}



// WHEN USER PRESSED LOGIN BUTTON !
exports.postShowLogin = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('%% login.js ::  REQUEST-POST TO EXECUTE LOGIN THE USER!')
  console.log('BELOW IS req.body SENT FROM USER FORM')
  console.log(req.body)


  const email = req.body.userEmail
  const pass = req.body.userPass


  // ---------------------------------------
  // FIND THE USER FROM DATABASE
  // USING ENTERED EMAIL
  User.findByEmail(email)
    .then(user => {

      if (!user) {
        // IF THERE IS NO MATCH...

        // DISPLAY SOME WARNING AND REDIRECT TO SAME PAGE
        console.log('%% login.js :: ACCOUNT DOES NOT EXIST !!!')

        // < SENDING MESSAGE USING FLASH >
        //
        req.flash('error', 'Your input does not matched')

        return res.redirect('/login')

      }

      // OR IF THERE IS THE MATCH...

      // ---------------------------------------
      // < COMPARING ENCRYPTED PASSWORD >
      //
      // THEN COMPARE THAT USER'S PASSWORD
      // USING bcrypt MODULE !
      bcrypt
        .compare(pass, user.pass)
        .then( bIsMatched => {

          // -----------------------------------------
          // < PASSWORD CHECK >
          //
          // IF THERE WAS MATCH...
          if( bIsMatched ) {

            // ---------------------------------------
            // CHECKING ADMIN MODE OR NOT


            // ---------------------------------------
            // < SETTING SESSION WITH USER >
            //console.log(`login.js(97)::   ${user.role}`)

            req.session.loginFlag = true
            req.session.user = user
            req.session.role = user.role

            return req.session.save( err => {
              if(err) {
                console.log('%% login.js :: ERROR OCCURED WHEN SAVING USER TO SESSION !')
                console.log(err)
              }
              res.redirect('/')
            })

          } else {
            // THERE WAS ACCOUNT, BUT PASSWORD WAS DIFFERENT

            // TODO :: DISPLAYING WARNING MESSAGE
            console.log('%% login.js :: ACCOUNT WAS EXISTED BUT PASSWORD WAS INCORRECT !!!')

            req.flash('error', 'Your input does not matched')

            return res.redirect('/login')

          }

        })

    })
    .catch( err => {
      console.log(err)
    })

}



// FOR LOGOUT FUNCTIONALITY
exports.postLogout = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('login.js ::  LOGOUT BUTTON PRESSED' )

  // DESTROY SESSION WHEN USER LOGGED OUT
  // THIS IS FROM connect-mongodb-session MIDDLEWARE
  //
  // #### THIS WILL DELETE 'SESSION' WHICH IS SERVER-SIDE
  //      NOT A CLIENT SIDE
  req.session.destroy((err)=>{
    if(err) console.log(err)
    res.redirect('/')
  })

}
