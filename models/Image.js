const mongoose = require('mongoose')


// SO WE WILL USE THIS MODEL LIKE
// const newImage = new Image(req.file)
//
// req.file IS FROM input ELEMENT FROM FRONTEND
//
// AND
//
// WE PASS req.file OBJECT LIKE BELOWS
//
// {
//   fieldname: 'uploadingImage',
//   originalname: 'PROFILE_GOUNBEEE.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: 'images/member-area/Gounbeee/uploadimg',
//   filename: '2022-10-27T00:52:47.634Z_PROFILE_GOUNBEEE.png',
//   path: 'images/member-area/Gounbeee/uploadimg/2022-10-27T00:52:47.634Z_PROFILE_GOUNBEEE.png',
//   size: 126105
// }
//
 


const imageSchema = new mongoose.Schema({
	imgOwner: {
		type: String,
		required: true
	},
	imgPath: {
		type: String,
		required: true
	},
	imgAlt: {
		type: String,
		required: true
	},
	imgTitle: {
		type: String,
		required: true
	},
	imgDesc: {
		type: String,
		required: true
	},
	
})



const Image = mongoose.model("images", imageSchema)




module.exports = Image

