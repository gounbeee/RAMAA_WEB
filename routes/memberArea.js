const express = require("express");
const router = express.Router();

const fs = require('fs')


const csurf = require('csurf')


const csrfProtection = csurf({cookie:true})

const Image = require('../models/Image')
const Category = require('../models/Category')
const Subject = require('../models/Subject')
const Json = require('../models/Json')



// ====================================================================================



router.post("/:username/delete-subject", csrfProtection, async (req, res) => {

	console.log( "DELETING SUBJECT REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	// --------------------------------------
	// < REQUEST VALUE WILL BE LIKE BELOW >

	if(req.body.type === 'SUBJECT') {

		// DELETE FILE EITHER !!!

		console.log("DELETING JSON FILE")
		console.log(req.body.json_path)


		try {
			
			fs.unlink(req.body.json_path, err => {

				if(err) { 
					console.log(err)
					return
				} else { 
					console.log("DELETING FILE OK") 
				}
				
			})

		} catch (err) {
			console.log(err) 
		}


		Subject.findByIdAndDelete(req.body.idToUpdate, (error) => {



			if(error === null) {
				console.log("WE DELETED YOUR SUBJECT DATA FROM OUR DATABASE SUCCESSFULLY !!")

        		res.status(200).send({
        			success: true,
        			message: "WE DELETED YOUR SUBJECT DATA FROM OUR DATABASE SUCCESSFULLY !!"
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


router.post("/:username/update-subject", csrfProtection, async (req, res) => {

	console.log( "UPDATING SUBJECT REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	// --------------------------------------
	// < REQUEST VALUE WILL BE LIKE BELOW >
	//
	// {
	//   type: 'SUBJECT',
	//   idToUpdate: '635ce9b4db4179e2091cd722',
	//   title: '1234aaaa',
	//   descriptions: '4356',
	//   keywords: '767',
	//   liked: 27,
	//   json_path: 'jsons/gounbeee@gmail.com/2022-10-29T08:52:04.424Z_0001.json'
	// }

	if(req.body.type === 'SUBJECT') {

		Subject.findById(req.body.idToUpdate)
		        .then( (subjectFound) => {

		        	if(!subjectFound) {

		        		res.status(404).send({
		        			success: false,
		        			message: "THERE IS NO MATCHED ID IN OUR DATABSE !!!!"
		        		})
		        	} else {

		        		console.log("SUBJECT FOUND !!!!")
		        		console.log(subjectFound)
		        		subjectFound.title = req.body.title
		        		subjectFound.descriptions = req.body.descriptions
		        		subjectFound.keywords = req.body.keywords
		        		subjectFound.liked = req.body.liked
		        		subjectFound.json_path = req.body.json_path

		        		subjectFound.save()


		        		res.status(200).send({
		        			success: true,
		        			message: "WE EDITTED YOUR SUBJECT DATA IN OUR DATABASE SUCCESSFULLY !!"
		        		})
		        	}

		        })
	}

})


router.post("/:username/create-subject", csrfProtection, async (req, res) => {

	console.log( "CREATING SUBJECT REQUESTED" )
	
	console.log( "req.body IS..." )
	console.log(req.body)


	// WE HAVE BELOW
	//{
	// title: '1234',
	// descriptions: '567',
	// keywords: '89',
	// liked: '22',
	// userEmail: 'gounbeee@gmail.com',
	// filename: '0001.json',
	// filesize: 4373,
	// filedata: '{\n' +
	//   '  "ec678c21-50f6-4
	//


	// AND WE NEED THE OBJECT LIKE BELOW
	//
	// title: {
	// 	type: String,
	// 	required: true
	// },
	// userEmail: {
	// 	type: String,
	// 	required: true
	// },
	// descriptions: {
	// 	type: String,
	// 	required: true
	// },
	// json_path: {
	// 	type: String,
	// 	required: true
	// },
	// keywords: {
	// 	type: String,
	// 	required: true
	// },
	// liked: {
	// 	type: Number,
	// 	required: false
	// }


	// 1. FIRST WE SAVE JSON FILE FROM STRING DATA
	const json_str = req.body.filedata

	console.log("TRANSFERRED JSON DATA IS....")
	console.log(json_str)

	// CONSTRUCTING PATH TO SAVE JSON FILE
	const targetPath = 'jsons/' + req.body.userEmail


	// < CREATING FOLDER !!!! >  AND < RECURSIVELY !!!! >
    // https://stackoverflow.com/questions/66075852/how-to-create-a-directory-that-take-the-name-of-username-in-nodejs
    // https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
    //
    //
    if (!fs.existsSync(targetPath)){
      //console.log("THERE IS NO FOLDER MATCHED SO WE WILL MAKE IT")
      fs.mkdirSync(targetPath, {recursive: true}); //create new directory and write to it.
     
    } 

    // FORMATTING FILE NAME
	const date = new Date().toISOString()
    const newFileName = date + '_' + req.body.filename


	const finalPath = targetPath + '/' + newFileName

	fs.writeFile( finalPath , json_str, 'utf8', (err) => {
		
		if (err) throw err;
		
		console.log("JSON SAVED !!!!")
	
	});



	const objToSubjectDB = {
		title: req.body.title,
		descriptions: req.body.descriptions,
		keywords: req.body.keywords,
		liked: req.body.liked,
		userEmail: req.body.userEmail,
		json_path: finalPath
	}


	const newSubject = new Subject(objToSubjectDB)
	await newSubject.save()
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


						console.log('AFTER CREATING SUBJECT TO DATABSE, THE RESULT IS...')
						console.log(result)

						if(result) {

							res.status(200).send({

								success: true,
								message: "CREATING SUBJECT FILE ADN SAVING TO DATABASE OK"
							})


						} else {

							res.status(500).send({

								success: false,
								message: "WE COULD NOT CREATE SUBJECT !"
								
							})
						}

					})

})


router.post("/:username/get_subjectlist",  async (req, res) => {

	console.log( "OK, RETRIEVING SUBJECTS FROM THIS USER'S DATABASE..." )
	console.log(req.body)
	console.log(req.url)


	// ------------------------------------------------------------------------------------------

	const foundSubjects = await Subject.find({userEmail: req.body.email})


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



// ====================================================================================





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
		        		categoryFound.name = req.body.name
		        		categoryFound.descriptions = req.body.descriptions
		        		categoryFound.targetUrl = req.body.targetUrl

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

	const objToCategoryDB = {
		name: req.body.name,
		userEmail: req.body.userEmail,
		descriptions: req.body.descriptions,
		targetUrl: req.body.targetUrl,
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





// ====================================================================================





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





// ====================================================================================






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