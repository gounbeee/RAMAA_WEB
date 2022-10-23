
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  


  // USING JWT
  // WE ARE AUTHORIZED USING TOKEN IN 
  // THE HEADER !!!
  // FOR JWT, THE DATA TYPE IS ARRAY, AND FIRST ONE IS Bearer SO WE 
  // FIND 'SECOND ONE'
  console.log("BEFORE jwt.verify ")
  console.log(req.headers.referrer)


  const token = req.headers.authorization.split(" ")[1];

  console.log(typeof(token))


  if(token !== "null") {

    const user = jwt.verify(token, "RAMAA");

    //console.log("AFTER jwt.verify ")
    //console.log(user)

    // ATTACHING THE USER TO REQUEST
    req.body.user = user;

    // BECAUSE THIS IS A MIDDLEWARE, YOU SHOULD 
    // CALL next() BECAUSE THIS RETURNS promise !!
    next();

  } else {
    console.log("****  NO USER MATCHED !  ****")

    //res.status(500).send({ message: "Invalid or Expired Token" });
    req.body.user = undefined  
    next();  
  }

};
