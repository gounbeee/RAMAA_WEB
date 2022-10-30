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




router.post("/:subjectcategory",  async (req, res) => {

	console.log( "OK, RETRIEVING SUBJECTS FROM THIS USER'S DATABASE..." )
	console.log(req.body)
	console.log(req.url)


	// ------------------------------------------------------------------------------------------

	// THIS IF FOR PUBLIC SO WE USED STATIC EMAIL VALUE
	const foundSubjects = await Subject.find({userEmail: process.env.EMAIL_ADDRESS, keywords: req.body.categoryName})


	// < find() IN MONGOOSE >
	// find() MONGOOSE FUNCTION WILL RETURN LIKE BELOW...

	// [
	//   {
	//     _id: new ObjectId("635a1d9ef5c71dc15015919d"),
	//     imgOwner: 'gounbeee@gmail.com',
	//     imgPath: 'images/gounbeee@gmail.com/2022-10-27T05:56:46.450Z_BANNER_GOUNBEEE.png',
	//     imgAlt: '444',
	//     imgTitle: '123',
	//     imgDesc: '333',
	//     __v: 0
	//   },
	//   {
	//     _id: new ObjectId("635a1e81049f27f284f5691c"),
	//     imgOwner: 'gounbeee@gmail.com',
	//     imgPath: 'images/gounbeee@gmail.com/2022-10-27T06:00:33.193Z_PROFILE_GOUNBEEE.png',
	//     imgAlt: 'ccc3333',
	//     imgTitle: 'aa111',
	//     imgDesc: 'bb222',
	//     __v: 0
	//   }
	// ]

	console.log(foundSubjects)


	// ******************************
	// BECAUSE THIS IS HTTP PROTOCOL,
	// WE CAN NOT SEND MULTIPLE FILES AT ONCE !!!!
	//https://stackoverflow.com/questions/70656776/is-it-possible-to-use-the-sendfile-response-method-in-node-express-to-send-to


	// -------------------------------------------------------
	// < READING FILES WITH NODE JS >
	// https://nodejs.dev/en/learn/reading-files-with-nodejs/
	//

	res.status(200).send({

		success: true,
		message: "RETRIEVING SUBJECTS FROM THIS USER'S DATABASE OK",
		foundSubjects: foundSubjects

	})

})




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