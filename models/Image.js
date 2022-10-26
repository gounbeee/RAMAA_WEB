const mongoose = require('mongoose')



const imageSchema = new mongoose.Schema({

	imgPath: {
		type: Buffer,
		contentType: String,
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



const Category = mongoose.model("categories", categorySchema)




module.exports = Category

