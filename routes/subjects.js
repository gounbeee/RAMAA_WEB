const express = require('express')
const router = express.Router()

const csurf = require('csurf')
const csrfProtection = csurf({cookie:true})


const Subject = require('../models/Subject')



router.get("/subjects", csrfProtection, async (req,res) => {

	try {

		console.log("DISPLAYING MAKE ACCOUNT PAGE")
		console.log(req.csrfToken())


		const sample_jsObj = { 
				SAMPLE_KEY_1: "SAMPLE_KEY_1_DATA",
				SAMPLE_KEY_2: "SAMPLE_KEY_2_DATA",
				SAMPLE_KEY_3: "SAMPLE_KEY_3_DATA",
		}


		// < CREATING NEW RECORD OF JSON WITH MONGOOSE >
		// https://stackoverflow.com/questions/17497875/storing-json-object-in-mongoose-string-key
		const newSubject = new Subject({

			title: 'first subject',
			descriptions: 'first subject Descriptions',
			json_data: JSON.stringify(sample_jsObj),
			keywords: "MATH,PROGRAMMING,LIFE",
			liked: 50
		})

		const result = await newSubject.save();

		console.log(result)



		res.status(200).send({

			success: true,
			message: "Displaying Subjects Page",
			csrfToken: req.csrfToken()

		});


	} catch { (err) => {

		console.log(err)

		}
	}


});




module.exports = router