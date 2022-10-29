const express = require('express')
const router = express.Router()

const csurf = require('csurf')
const csrfProtection = csurf({cookie:true})


const Category = require('../models/Category')
const Subject = require('../models/Subject')


// -------------------------------------------
// < CREATING NEW RECORD TO MONGO DB USING MONGOOSE > 
//
// const sample_jsObj = { 
// 		SAMPLE_KEY_1: "SAMPLE_KEY_1_DATA",
// 		SAMPLE_KEY_2: "SAMPLE_KEY_2_DATA",
// 		SAMPLE_KEY_3: "SAMPLE_KEY_3_DATA",
// }
//
//
// // < CREATING NEW RECORD OF JSON WITH MONGOOSE >
// // https://stackoverflow.com/questions/17497875/storing-json-object-in-mongoose-string-key
// const newSubject = new Subject({

// 	title: 'first subject',
// 	descriptions: 'first subject Descriptions',
// 	json_data: JSON.stringify(sample_jsObj),
// 	keywords: "MATH,PROGRAMMING,LIFE",
// 	liked: 50
// })
//
// const result = await newSubject.save();
//
// console.log(result)




router.get("/", csrfProtection, async (req,res) => {

	try {

		console.log("DISPLAYING SUBJECTS PAGE")
		console.log(req.csrfToken())

		// WHEN WE OPEND SUBJECT PAGE,
		// 1. WE RETRIEVE CATEGORIES DATA FROM DATABASE,
		const foundCategories = await Category.find({userEmail: process.env.EMAIL_ADDRESS})


		

		console.log(foundCategories)


		// 2. THEN SEND THE RESULT




		res.status(200).send({

			success: true,
			message: "Displaying Subjects Page",
			csrfToken: req.csrfToken(),
			foundCategories: foundCategories

		});


	} catch { (err) => {

		console.log(err)

		}
	}


});




module.exports = router