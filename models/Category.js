const mongoose = require('mongoose')



const categorySchema = new mongoose.Schema({

	img: {
		type: String,
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
	url: {
		type: String,
		required: true
	}

})



const Category = mongoose.model("categories", categorySchema)




module.exports = Category

