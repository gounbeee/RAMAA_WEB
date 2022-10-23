// RAMAA APP by gounbeee
//


// ####------------------------------------------------------------####
// USING DEBUGGER !!!!
//   https://nodejs.org/api/debugger.html
//   https://blog.hiroppy.me/entry/nodejs-performance




/**
< require FUNCTION >
https://nodejs.org/en/knowledge/getting-started/what-is-require/

EVALUATING THE OBJECT(js FILE), THEN RETURN THAT OBJECT


-------------------------------------------
example.js

  //-// console.log("evaluating example.js");

  var invisible = function () {
    //-// console.log("invisible");
  }

  exports.message = "hi";

  exports.say = function () {
    //-// console.log(exports.message);
  }

-------

example WILL COLLECT 'exports.<SOMETHING>'

var example = require('example.js')

-------
{
  message: "hi",
  say: [Function]
}
-------

-------------------------------------------

*/




/**
< module.exports >

https://www.webdesignleaves.com/pr/jquery/node-js-module-exports.html

前述の例では関数と値を個別にエクスポートしましたが、1つだけをエクスポートするモジュールがある場合などは
module.exports を使用するのがより一般的です。
CommonJS モジュールは Node.js のグローバル変数 module を使って変数や関数などをエクスポートします。
CommonJS モジュールでは module.exports プロパティに代入されたオブジェクトが、
その JavaScript ファイルからエクスポートされます（JavaScript Primer より引用）。


#####
exports は module.exports のショートカットのようなもので、初期状態では exports は module.exports への参照です。

#####
modules.exports にオブジェクトを指定すると、exports は modules.exports の参照ではなくなります。
*/





/**
< express.static(root, [options]) FUNCTION >
https://expressjs.com/en/4x/api.html

This is a built-in middleware function in Express.
It serves static files and is based on serve-static.

The root argument specifies the root directory from which
to serve static assets. The function determines the file to
serve by combining req.url with the provided root directory.

When a file is not found, instead of sending a 404 response,
it instead calls next() to move on to the next middleware,
allowing for stacking and fall-backs.

*/


/**
< use() FUNCTION IN EXPRESS >
http://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps

use() FUNCTION IS FOR MAKING CHAINS OF FUNCTIONS.

The order of middleware loading is important:
middleware functions that are loaded first are
also executed first.



####
With no mount path,
the function is executed every time
the app receives a request.

*/




/**
 * < ABOUT CSRF (CROSS SITE REQUEST FORGERY) AND CORS (CROSS ORIGIN RESOURCE SHARING) > 
 * https://www.stackhawk.com/blog/react-csrf-protection-guide-examples-and-how-to-enable-it/
 * 
 * CSRF Protection: The Reliable Solution
 * Let's go through the steps you can follow to protect 
 * your application against a CSRF attack. 
 *
 * 
 * X : USING WEB STORAGE ? -> X
 * X : 'POST' REQUEST      ? -> X
 * 
 * 
 * O :
 * < Using CORS on the Server >
 * CORS stands for cross-origin resource sharing. It's a 
 * protocol that allows your client to send requests and 
 * accept responses from a server that has a different 
 * origin. Normally, the browser uses an SOP or same-origin 
 * policy to ensure that your server only listens to requests 
 * from clients of the same origin.
 * 
 * ** SAME ORIGIN POLICY :: SOP **
 * 
 * 
 * O :
 * < USING CSRF TOKEN >
 * CSRF tokens, also called anti-CSRF tokens, let your server 
 * communicate to the client before an authenticated request 
 * is made that may be tampered with.
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 **/





/**
 * < NODE JS DEBUGGING >
 * https://qiita.com/nju33/items/9c5fd326bd7a58886af8
 * 
 * NIM CHROME EXTENSION
 * 
**/

/** 
 *  < DELETING iptables SETTING >
 *  https://www.cyberciti.biz/faq/linux-iptables-delete-prerouting-rule-command/
 * 
 * 
 *  sudo iptables -t nat --delete PREROUTING 1
 * 
 * 
 **/




/** 
 *  < ROUTING TO 3333 PORT FROM 80 ACCESS! >
 *  https://gist.github.com/kentbrew/776580
 *  
 * : IN WEB SERVER (AWS), 
 * 
 *   sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports <3333> 
 *   sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports <3333> 
 *                                                                                ~~~~
 *                                                                               PORT No.
 * : FOR LISTING CURRENT FORWARDINGS
 *   sudo iptables -t nat -L
 * 
 *   sudo iptables -t nat -v -L PREROUTING -n --line-number
 **/





/**
 * < NODE JS WITH APACHE + ROUTING PORT WHICH NODEJS IS USING >
 * https://dev.to/arifintahu/how-to-set-up-free-ssl-for-nodejs-app-in-aws-ec2-30fj
 * 
 *
 * # Lookup IP routing tables
 * sudo iptables -t nat -L
 *
 * # Add HTTP port 80 and 443 traffic redirect rule
 * sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
 * sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443
 *
 * 
 **/





// -----------------------------------------------------------
// IMPORTING MODULES


const PORTNUM = 5000


const path = require('path')

const dotEnv = require("dotenv").config();
 
// USING EXPRESS
const express = require('express')


// USING MONGOOSE
const mongooseModule = require('./database/database.js')

// IMPORT USER MODULE
const User = require('./models/User.js')

// IMPORT checkLogin MODULE
const checkLogin = require('./middlewares/authMiddleWare.js')

// USING SESSION FOR EXPRESS
// IMPORT CSRF MODULE TO CSRF PROTECTION
// COOKIE
const session = require('express-session')

const cookieParser = require('cookie-parser')

// USING BODY-PARSER
// TO GETTING ACCESS TO REQUEST'S STRUCTURE
const bodyParser = require('body-parser')


// // IMPORT connect-flash TO INDICATE MESSAGE
// const flash = require('connect-flash')

// // FOR HTTP AND HTTPS COOMUNICATION
// const http = require('http');
// const https = require('https');

const fs = require('fs');



console.log('%% app.js ::  mongoDBURI IS --   ' + process.env.MONGO_URL )



// < NODE JS AND TLS CERTS'S PERMISSION + PASSPHRASE >
// https://stackoverflow.com/questions/52556932/nodejs-enabling-ssl
// https://serverfault.com/questions/903871/ssl-permission-error-node-js-with-https-lets-encrypt-ssl-apache-non-root
// https://stackoverflow.com/questions/38557213/giving-node-js-access-to-certificate-private-key
var key  = fs.readFileSync(__dirname + '/server.key');
var ca   = fs.readFileSync(__dirname + '/ca.crt');
var cert = fs.readFileSync(__dirname + '/server.crt');
var options = {
  key: key,
  ca: ca,
  cert: cert,
  passphrase: process.env.PASSPHRASE
};







// -----------------------------------------------------------
// < STORING SESSION TO MONGO DB !! >
// IF WE STORE EVERY CLIENT'S SESSIONS ON MEMORY,
// IT WILL BE OVERFLOWED SOON, SO YOU STORE IT DB

// const storingSessions = new mongoDBSession({
//   uri: process.env.MONGO_URL,
//   collection: 'sessions'
// })










// --------------------------------------
// CREATING INSTANCE OF EXPRESS
const app = express()






/**
Server CLASS IN HTTP MODULE
https://nodejs.org/docs/latest-v14.x/api/http.html#http_class_http_server

BELOW, AFTER WE EVALUATED http MODULE, WE INITIALIZED "http.Server OBJECT".
AT THAT TIME, WE USED express OBJECT AS PARAMETER.


*/

/**
Server CLASS ITSELF IS EXTENDED FROM net.Server CLASS, AND THIS CLASS CREATES
TCP OR IPC SERVER.

https://nodejs.org/docs/latest-v14.x/api/net.html#net_class_net_server


AND, WHEN WE INITIALIZE net.Server CLASS LIKE BELOW,
new net.Server([options][, connectionListener])

WE CAN SEE IT ACCEPTS options WHICH IS <Object> CLASS
*/






// DATABASE CONNECTION
const mongoConnect = require('./database/database.js').mongoConnect


// -----------------------------------------------------------
// GETTING CONTROLLERS
// const loginController = require('./controller/login.js')
// const signupController = require('./controller/signup.js')
// const resetpassController = require('./controller/resetpw.js')
// const sourceController = require('./controller/source.js')




// --------=----=----=----=----=----=----=----=----=
// USE json()!!!!!
// https://stackoverflow.com/questions/58401434/input-undefined-when-sending-post-request-to-the-nodejs-api-using-react-and-axio
//
// BECAUSE WE USE AXIOS TO HANDLE GET+POST REQUEST
// AND AXIOS HANDLES REQUESTS USING JSON !!!!
//
app.use(express.json())

// --------------------------------------------------------------------------

// < SESSION AND COOKIE ARE USING FOR IDENTIFYING 'YOU'
// (BROWSER, CLIENT) >
//
// BASICALLY, 'COOKIE' CAN BE DELETED BY USER BUT,
// 'SESSION' WILL REMEMBER YOU WITH THE RECORD RELIED ON COOKIE
// (WITHIN THE EXPIRING MOMENT)
//
//
// HERE WE ACTUALLY 'SET' THE SESSION USING THE MIDDLEWARE
// #### THE MIDDLEWARE AUTOMATICALLY SET AND READ THE 'COOKIE'
//
//
// < req.session.id >
// Each session has a unique ID associated with it. 
// This property is an alias of req.sessionID and cannot be modified. 
// It has been added to make the session ID accessible from the session object.

// < req.session.cookie >
// Each session has a unique cookie object accompany it. 
// This allows you to alter the session cookie per visitor. For example we 
// can set req.session.cookie.expires to false to enable the cookie to remain 
// for only the duration of the user-agent.

// < Cookie.maxAge >
// Alternatively req.session.cookie.maxAge will return the time remaining 
// in milliseconds, which we may also re-assign a new value to adjust the .expires 
// property appropriately. The following are essentially equivalent

// < sessionKey (csrfSecret) >
// Determines what property (“key”) on req the session object is located. 
// Defaults to 'session' (i.e. looks at req.session). The CSRF secret from this 
// library is stored and read as req[sessionKey].csrfSecret.
// 




// --------------------------------------------------------
// BODY PARSER FOR JSON
// https://github.com/github/fetch/issues/323
// post('/save-to-json'


// --------------------------------------------------------
// CHANGING LIMIT OF UPLOADING SIZE
// https://stackoverflow.com/questions/19917401/error-request-entity-too-large
// 
app.use(bodyParser.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}))



// WE ARE USING COOKIEPARSER
app.use(cookieParser('cookie-parser-secret'));




// --------------------------------------
// SETTING CSRF PROTECTION
// https://stackoverflow.com/questions/23997572/error-misconfigured-csrf-express-js-4
//


app.use( session({
          cookieName: {},
          secret: 'this_is_gounbeee_com_session',
          resave: false,
          saveUninitialized: false,
        }))




// --------------------------------------------------------------------------
// CSRF PROTECTION USING CSURF MODULE
// https://www.stackhawk.com/blog/react-csrf-protection-guide-examples-and-how-to-enable-it/
//
//
// WITH THIS, YOU WILL SEE IMMEDIATELY THE TOKEN INFORMATION
// IN YOUR COOKIE,
//
// THEN, AFTER THIS, EVERY 'NON-GET' REQUEST FROM CLIENT
// SHOULD HAVE PROPER TOKEN !!
// SO YOU WILL FIX 'CONTROLLERS' AND VIEWS!!


// WITH BELOW LINE, CSRF TOKEN WILL BE CREATED AND
// CAN BE SEEN AT DEVELOPER TOOL !!!!
// COOKIE'S NAME IS -> _csrf
// app.use(csurf(
//   "123456789abcdefghi9876543210zyxw",
//   ["POST"],
//   [],
//   [process.env.SITE_URL + "/service-worker.js"]
//   ))


// app.use(csurf())



// --------------------------------------------------------------------------
// AND BELOW IS FOR GETTING CSRF TOKEN 'LATER'
// WHEN USER CLICKED SOME BUTTONS TO SEND SENSITIVE INFORMATION
// LIKE LOGIN BUTTON, MAKE TRANSACTION BUTTON ETC.
// app.get('/getCSRFToken', (req, res) => {
//   const tk = req.csrfToken()
//   console.log(tk)

//   res.json({ CSRFToken: tk })

// })



// --------------------------------------------------------------------------
// ROUTE SETTING
//
const authRoute        = require("./routes/auth");
const userRoute        = require("./routes/user");
const memberAreaRoute  = require("./routes/memberArea");
 


// SETTING ROUTES
//
// **** ROUTE FOR EXPRESS SERVER ****
//      ~~~~~~~~~~~~~~~~~~~~~~~~
//
//    < BASIC ROUTE > + < ROUTE IN BELOW ROUTE FILE >
//                                  ^^
//                                  ||
//                              _________
app.use("/api/auth",            authRoute);
app.use("/api/user",            userRoute);
app.use("/member-area",         memberAreaRoute);





//app.use(express.static('public'))


app.use('/static', express.static(path.join(__dirname, 'public')))




// // SETTING UP BODY PARSER
// app.use(bodyParser.urlencoded({extended: false }))


// // SETTING PUBLIC FOLDER TO OPEN TO USERS
// app.use( express.static(path.join(__dirname, 'public')))

















// // --------------------------------------------------------------------------
// // FLASH SETTING
// // #### YOU NEED TO SET BELOW AFTER THE SESSION SETTING ABOVE !!! ####
// //
// // FLASH IS FOR SENDING MESSAGE TO CLIENT WITH REQUEST
// //
// // SO, HERE WE ARE REGISTERED flash AS MIDDLEWARE,
// // NOW WE CAN USE THIS EVERY PLACE WHICH REQUEST OBEJECT IS USED
// //
// // AFTER THIS REGISTRATION, YOU WILL MODIFY THE CONTROLLER !!
// app.use(flash())





// // --------------------------------------------------------------------------

// // USER SETTING
// app.use((req, res, next) => {

//   // IF THERE IS NO USER IN SESSION...
//   if( !req.session.user ) {
//     ////-// console.log("%% app.js :: THERE IS NO USER IN [SESSION]")
//     return next()
//   }

//   // BELOW USER IS 'DEFAULT USER' FOR DEVELOPMENT
//   User.findById(req.session.user._id)
//     .then(user => {

//       // GETTING USER FROM DATABASE
//       // BASED ON THE SESSION
//       req.user = user

//       next()
//     })
//     .catch( err => {
//       //-// console.log('%% app.js :: THERE WAS AN ERROR TO DEFAULT USER CREATION !')
//       //-// console.log(err)
//     })

// })






// // --------------------------------------------------------------------------


// /**
// < get() FUNCTION IN EXPRESS > 
// http://expressjs.com/en/5x/api.html#app.get

// app.get(path, callback [, callback ...])

// Routes HTTP GET requests to the specified path
// with the specified callback functions.

// */



// // mongodb+srv://gounbeee:<password>@cluster0.tfvlo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority



// // --------------------------------------------------------
// // < LOADING AUTHENTICATION INFORMATION >
// //
// // THIS IS CRITICAL TO PROTECT FROM CSRF!
// // THIS WILL GENERATE TOKEN AND SEND TO VIEW
// //
// // FINALLY, YOU NEED TO EMBED THIS INFORMATION TO HTML FILE
// app.use((req, res, next) => {

//   // < USING locals >
//   // #### YOU CAN USE locals TO SEND THE INFORMATION TO VIEWS !!! ####
//   //
//   // <input type="hidden" name="_csrf" value="<%= csrfToken %>">
//   // SHOULD BE ADDED BEFORE THE ELEMENT WHICH IS NOT 'GET-REQUEST'
//   // FOR EXAMPLE '<button>'
//   res.locals.role = req.session.role
//   res.locals.loginFlag = req.session.loginFlag
//   res.locals.csrfToken = req.csrfToken()
//   console.log(`CURRENT  res.locals.role  IS  ->   ${res.locals.role}`)
//   console.log(`CURRENT  res.locals.loginFlag  IS  ->   ${res.locals.loginFlag}`)
//   console.log(`CURRENT  res.locals.csrfToken  IS  ->   ${res.locals.csrfToken}`)
//   next()
// })






// // --------------------------------------------------------
// // < ROUTERS > + < ROUTER PROTECTION >

// // ROUTE TO SIGN UP PAGE
// //
// // < ABOUT checkLogin MIDDLEWARE >
// // checkLogin MIDDLEWARE IS CUSTOM-MADE MIDDLEWARE
// // TO CHECK THE USER IS CURRENTLY LOGGED IN OR NOT
// //
// // #### MIDDLEWARE IS REGISTERED FROM "LEFT TO RIGHT" ####
// //


// // ROUTE TO RE'NEW' PASSWORD PAGE
// app.post('/renewpass', resetpassController.postRenewPass)
// app.get('/reset/:token', resetpassController.getRenewPass)

// // ROUTE TO RESET PASSWORD PAGE
// app.post('/resetpass', resetpassController.postResetPass)
// app.get('/resetpass', resetpassController.getResetPass)

// // ROUTE TO SIGNUP PAGES
// app.post('/createAccount', signupController.postShowSignup)
// app.get('/signup', signupController.getShowSignup)

// // ROUTE TO LOGIN LOGOUT FUNCTIONS
// app.post('/login', loginController.postShowLogin)
// app.get('/login', loginController.getShowLogin)
// app.post('/logout',  checkLogin,loginController.postLogout)


// app.get('/get-token', (req, res) => {
//   res.json({
//     csrfToken: req.csrfToken()
//   })
//   console.log(`-- get-token REQUEST ::  ${req}`)
//   console.log(`--                   ::  ${req.csrfToken()}`)
// })


// // ROUTE TO SOURCE MENU BUTTONS
// app.post('/save-to-json', sourceController.postSaveToJson)

// // app.get('/your-contents', checkLogin, sourceController.getYourContents)
// // app.post('/create-yourcontents-page', sourceController.postCreateYrCntPg)




// // ROUTE TO MAIN PAGE
// app.get('/main', function(req, res) {
//   ////-// console.log('----------------------------------------------')

//   // ----------------------------------------------------
//   // < SETTING COOKIE WITHOUT SESSION ! >
//   // #### BUT WE DO NOT DO THIS WITHOUT SESSION !!!! ####
//   //
//   // COOKIE CAN MOVE THROUGH THE MULTIPLE PAGES,
//   // THAT IS WHY COOKIE IS USED
//   //res.setHeader('Set-Cookie', 'loggedIn=true')


//   //-// console.log("%% app.js ::  REQUEST-GET HAS CAME AND WILL RENDER index.ejs")

//   // USER IN 'SESSION' CHECK
//   if( req.session.user ) {
//     console.log("%% app.js :: USER (IN SESSION) CHECK")
//     console.log(req.session.user)
//   }

//   // USER IN REQUEST CHECK
//   if( req.user ) {
//     console.log("%% app.js ::  USER (IN REQUEST) CHECK")
//     console.log(req.user)
//   }

//   //-// console.log("$$ app.js ::  CURRENT req.session.loginFlag IS --- " + req.session.loginFlag)
//   //res.render('main.ejs')
  

//   // res.sendFile(path.join(__dirname, "view", "main.html"))



// })






const settings = {
  portNum: PORTNUM,
  callback: () => {
    console.log("CONNECTING...")
    app.listen(PORTNUM, ()=> console.log(`SERVER IS RUNNING ON PORT ${PORTNUM}`))

  }
}

mongooseModule.connectToDB(settings)

















