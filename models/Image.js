const mongoose = require('mongoose')



const imageSchema = new mongoose.Schema({

	img: {
		type: Buffer,
		contentType: String,
		required: true
	},
	imgAlt: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	
})



const Category = mongoose.model("categories", categorySchema)




module.exports = Category

