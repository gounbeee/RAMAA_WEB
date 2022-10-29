const express = require("express");
const router = express.Router();

const fs = require('fs')


const csurf = require('csurf')


const csrfProtection = csurf({cookie:true})

const Image = require('../models/Image')
const Category = require('../models/Category')



router.post("/:username/get_categorylist",  async (req, res) => {

	console.log( "OK, RETRIEVING CATEGORIES FROM THIS USER'S DATABASE..." )
	console.log(req.body)
	console.log(req.url)


	// ------------------------------------------------------------------------------------------

	const foundCategories = await Category.find({userEmail: req.body.email})


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

	console.log(foundCategories)


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
		message: "RETRIEVING CATEGORIES FROM THIS USER'S DATABASE OK",
		foundCategories: foundCategories

	})

})





router.post("/:username/get_imagelist",  async (req, res) => {

	console.log( "OK, RETRIEVING IMAGES FROM THIS USER'S DATABASE..." )
	console.log(req.body)
	console.log(req.url)


	const targetURLString = `/images/${req.body.email}`

	// ------------------------------------------------------------------------------------------

	const foundImages = await Image.find({email: req.body.email})

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

	console.log(foundImages)


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
		message: "RETRIEVING IMAGES FROM THIS USER'S DATABASE OK",
		foundImages: foundImages

	})

})










router.post("/:username/delete-category", csrfProtection, async (req, res) => {

	console.log( "DELETING CATEGORY REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	// --------------------------------------
	// < REQUEST VALUE WILL BE LIKE BELOW >
	//
	// idToUpdate : 
	// "635bd9078d33757f08e8f1e0"      <--  TARGET DATA ID (WHICH IS UNIQUE)
	//
	// type : 
	// "CATEGORY"     <--  TAG VALUE FOR VALIDATION

	if(req.body.type === 'CATEGORY') {

		Category.findByIdAndDelete(req.body.idToUpdate, (error) => {

			if(error === null) {
				console.log("WE DELETED YOUR CATEGORY DATA FROM OUR DATABASE SUCCESSFULLY !!")

        		res.status(200).send({
        			success: true,
        			message: "WE DELETED YOUR CATEGORY DATA FROM OUR DATABASE SUCCESSFULLY !!"
        		})

			} else {

				console.log("THERE IS NO MATCHED ID IN OUR DATABSE !!!!")
				console.log(error)

        		res.status(404).send({
        			success: false,
        			message: "THERE IS NO MATCHED ID IN OUR DATABSE !!!!"
        		})

			}

		})

	}

})













router.post("/:username/update-category", csrfProtection, async (req, res) => {

	console.log( "UPDATING CATEGORY REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	// --------------------------------------
	// < REQUEST VALUE WILL BE LIKE BELOW >
	//
	// idToUpdate : 
	// "635bd9078d33757f08e8f1e0"      <--  TARGET DATA ID (WHICH IS UNIQUE)
	//
	// type : 
	// "CATEGORY"     <--  TAG VALUE FOR VALIDATION
	//
	// value : 
	// "Mdfsdfath"    <--  EDITTED VALUE


	if(req.body.type === 'CATEGORY') {

		Category.findById(req.body.idToUpdate)
		        .then( (categoryFound) => {

		        	if(!categoryFound) {

		        		res.status(404).send({
		        			success: false,
		        			message: "THERE IS NO MATCHED ID IN OUR DATABSE !!!!"
		        		})
		        	} else {
		        		categoryFound.name = req.body.value
		        		categoryFound.save()

		        		res.status(200).send({
		        			success: true,
		        			message: "WE EDITTED YOUR CATEGORY DATA IN OUR DATABASE SUCCESSFULLY !!"
		        		})
		        	}

		        })
	}

})






router.post("/:username/create-category", csrfProtection, async (req, res) => {

	console.log( "CREATING CATEGORY REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	// ------------------------------------------------
	// SAVE FILE IS DONE MY MIDDLEWARE 'MULTER'
	// IN app.js !!!!


	// ------------------------------------------------
	// SAVE INFORMATION TO DATABASE EITHER
	//
	// 1. CONSTRUCT PROPER OBJECT FOR OUR SCHEMA IN MONGOOSE (MONGO DB)
	//    **** BECAUSE WE DEFINED SCHEMA AT models/image.js ****
	// 
	// WE HAVE 2 THINGS req.body AND req.file
	//
	//
	// AND WE NEED THE OBJECT LIKE BELOW
	// imgOwner: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgPath: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgAlt: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgTitle: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgDesc: {
	// 		type: 					String,
	// 		required: true
	// },

	const objToCategoryDB = {
		name: req.body.name,
		userEmail: req.body.userEmail,
	}

	const newCategory = new Category(objToCategoryDB)
	await newCategory.save()
					.then((result) => {

						// < RESULT FROM MONGOOSE WILL BE LIKE BELOWS >
						// 
						// {
						//   imgPath: 'images/gounbeee@gmail.com/2022-10-27T01:31:20.037Z_LOGO.png',
						//   imgAlt: 'image alt 333333333',
						//   imgTitle: 'title image 11111',
						//   imgDesc: 'desc image 22222222',
						//   _id: new ObjectId("6359df68e0db481d7028a80e"),
						//   __v: 0
						// }


						console.log('AFTER CREATING CATEGORY TO DATABSE, THE RESULT IS...')
						console.log(result)

						if(result) {

							res.status(200).send({

								success: true,
								message: "CREATING CATEGORY FILE ADN SAVING TO DATABASE OK"
							})


						} else {

							res.status(500).send({

								success: false,
								message: "WE COULD NOT CREATE CATEGORY !"
								
							})
						}

					})

})






router.post("/:username/uploadimg", csrfProtection, async (req, res) => {

	console.log( "UPLOADING IMAGE REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	console.log( "req.file IS..." )
	console.log(req.file)


	// ------------------------------------------------
	// SAVE FILE IS DONE MY MIDDLEWARE 'MULTER'
	// IN app.js !!!!


	// ------------------------------------------------
	// SAVE INFORMATION TO DATABASE EITHER
	//
	// 1. CONSTRUCT PROPER OBJECT FOR OUR SCHEMA IN MONGOOSE (MONGO DB)
	//    **** BECAUSE WE DEFINED SCHEMA AT models/image.js ****
	// 
	// WE HAVE 2 THINGS req.body AND req.file
	//
	//
	// AND WE NEED THE OBJECT LIKE BELOW
	// imgOwner: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgPath: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgAlt: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgTitle: {
	// 		type: 					String,
	// 		required: true
	// },
	// imgDesc: {
	// 		type: 					String,
	// 		required: true
	// },

	const objToImageDB = {
		imgOwner: req.body.email,
		imgPath: req.file.path,
		imgAlt: req.body.imgAlt,
		imgTitle: req.body.imgTitle,
		imgDesc: req.body.imgDesc,
	}

	const newImage = new Image(objToImageDB)
	await newImage.save()
					.then((result) => {

						// < RESULT FROM MONGOOSE WILL BE LIKE BELOWS >
						// 
						// {
						//   imgPath: 'images/gounbeee@gmail.com/2022-10-27T01:31:20.037Z_LOGO.png',
						//   imgAlt: 'image alt 333333333',
						//   imgTitle: 'title image 11111',
						//   imgDesc: 'desc image 22222222',
						//   _id: new ObjectId("6359df68e0db481d7028a80e"),
						//   __v: 0
						// }


						console.log('AFTER SAVING IMAGE TO DATABSE, THE RESULT IS...')
						console.log(result)

						if(result) {

							res.status(200).send({

								success: true,
								message: "UPLOADING IMAGE FILE ADN SAVING TO DATABASE OK"
							})


						} else {

							res.status(500).send({

								success: false,
								message: "WE COULD NOT SAVE YOUR FILE TO DATABASE !"
								
							})
						}

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