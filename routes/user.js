const express = require("express");
const router = express.Router();
const authmiddleWare = require("../middlewares/authMiddleWare");





// MIDDLEWARE SETTINGS
// SO WHEN USER REQUESTED /getuserinfo 
// FIRST WE EXECUTE authmiddleWare, (ATTACHING req.body.user) THEN EXECUTE
// THIS CALLBACK FUNCTION
router.get("/getuserinfo", authmiddleWare, async (req, res) => {

  // UNTIL THIS MIDDLWARE, WE CHECK THERE IS VALID USER
  // FROM CLIENT'S LOCAL STORAGE, SEND IT TO CLIENT
  try {
    //console.log(req.body)

    if(req.body.user !== undefined) {

      // USER IS SEARCHED !!!!
      res.send({ success: true, userData: req.body.user });
  
    } else {

      // USER IS NOT FOUND !!
      // SHOULD ROUTE TO '/'' ROUTE !!!!

      res.send({ success: true, userData: "OUR-GUEST" });

    }

    
  } catch (error) {

    // IF AN ERROR OCCURED, IT MEANS THERE IS NO MATCHED USER
    res.status(400).send(error);

  }


});



module.exports = router;
