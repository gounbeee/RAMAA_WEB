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
 


const jsonSchema = new mongoose.Schema({
	jsonOwner: {
		type: String,
		required: true
	},
	jsonPath: {
		type: String,
		required: true
	},
	
})



const Json = mongoose.model("jsons", jsonSchema)




module.exports = Json

