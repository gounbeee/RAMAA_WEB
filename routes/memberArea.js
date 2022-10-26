const express = require("express");
const router = express.Router();



const csurf = require('csurf')


const csrfProtection = csurf({cookie:true})





router.get("/:username/get_imagelist", csrfProtection, async (req, res) => {

	console.log( "OK, RETRIEVING IMAGES FROM THIS USER'S DATABASE..." )

	console.log(req.body)
	


	console.log(req.url)









	res.status(200).send({

		success: true,
		message: "RETRIEVING IMAGES FROM THIS USER'S DATABASE OK"
		
	})



})







router.post("/:username/uploadimg", csrfProtection, async (req, res) => {

	console.log( "UPLOADING IMAGE REQUESTED" )

	console.log(req.body)
	console.log(req.file)


	res.status(200).send({

		success: true,
		message: "UPLOADING IMAGE FILE OK"
		
	})



})










router.get("/:username", csrfProtection , async (req, res) => {

	console.log("MEMBER-AREA REQUESTED")
	console.log(req.headers)

	res.status(200).send({

			success: true,
			message: "Displaying MEMBER ADMIN PAGE",
			csrfToken: req.csrfToken()

		});


})



module.exports = router