const mongoose = require('mongoose')



const categorySchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	descriptions: {
		type: String,
		required: true
	},
	targetUrl: {
		type: String,
		required: true
	},
	userEmail: {
		type: String,
		required: true
	},
})



const Category = mongoose.model("categories", categorySchema)




module.exports = Category

