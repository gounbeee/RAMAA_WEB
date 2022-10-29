const mongoose = require('mongoose')


// OUR SUBJECT DATA FORMAT
//
//
//
// (UNIQUE) ID   >> THIS WILL BE ADDED AUTOMATICALLY !
//
// TITLE
//
// DESCRIPTIONS
//
// JSON_DATA
//
// KEYWORDS
//
// LIKED
//
// 
//



const subjectScheme = new mongoose.Schema({

	
	title: {
		type: String,
		required: true
	},
	userEmail: {
		type: String,
		required: true
	},
	descriptions: {
		type: String,
		required: true
	},
	json_path: {
		type: String,
		required: true
	},
	keywords: {
		type: String,
		required: true
	},
	liked: {
		type: Number,
		required: false
	}
	
})



const Subject = mongoose.model("subjects", subjectScheme)




module.exports = Subject



