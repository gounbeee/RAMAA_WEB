// DATABASE ACTION FOR USER


const mongoose = require('mongoose')


const userScheme = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isMember: {
    type: Boolean,
    default: false
  }

})



// < COMPILING MODEL USING MONGOOSE >
// https://mongoosejs.com/docs/models.html
// :: When you call mongoose.model() on a schema, Mongoose 
//    compiles a model for you.
//    The .model() function makes a copy of schema.
//    Make sure that you've added everything you want to schema, 
//    including hooks, before calling .model()!
const User = mongoose.model("users", userScheme)



module.exports = User


















// ----------  BELOW IS MONGO DB VERSION ----------


// const mongodb = require('mongodb')
// const getDB = require('../database/database.js').getDB





// // < OBJECT ID IN MONGO DB >
// // https://www.geeksforgeeks.org/what-is-objectid-in-mongodb/
// //
// // Every document in the collection has an “_id” field
// // that is used to uniquely identify the document
// //
// // ObjectID is a 12-byte Field Of BSON type
// //
// // BELOW IS FOR TPYE-MATCHING
// const ObjectId = mongodb.ObjectId


// class User {

//   // USER WILL HAVE NAME, EMAIL, MATHNODE, ID
//   constructor(username, email, pass, role, id) {
//     this.name = username
//     this.email = email
//     this.pass = pass
//     this.role = role
//     this.resetToken = undefined
//     this.resetTokenExpiration = undefined
//     this._id = id
//   }


//   // FOR SAVING TO DATABASE
//   save() {
//     const db = getDB();
//     return db.collection('users').insertOne(this);
//   }


//   // UPDATE DOCUMENT
//   update() {
//     const db = getDB();

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: this._id },
//         { $set: {
//           name: this.name,
//           email: this.email,
//           pass: this.pass,
//           role: this.role,
//           resetToken: undefined,
//           resetTokenExpiration: undefined }
//         }
//       )
//       .catch(err => {
//         console.log(err)
//       })

//   }


//   // UPDATE DOCUMENT' TOKEN
//   updateToken(tokenData) {
//     const db = getDB();

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: this._id },
//         { $set: {
//           name: this.name,
//           email: this.email,
//           pass: this.pass,
//           role: this.role,
//           resetToken: tokenData.resetToken,
//           resetTokenExpiration: tokenData.resetTokenExpiration }
//         }
//       )
//       .catch(err => {
//         console.log(err)
//       })

//   }



//   // TO FIND THE USER WITH ID
//   static findById(userId) {
//     const db = getDB();

//     // FIND USER FROM USERS COLLECTION
//     // USING USER'S ID
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         console.log('%% user.js findById() :: FOUND BELOW USER')
//         console.log(typeof user)
//         console.log(user)

//         //console.log('%% user.js findById() :: user.save IS ...')
//         //console.log(user.save)
//         return user
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }


//   static findByEmail(email) {
//     const db = getDB()

//     // FIND USER FROM USERS COLLECTION
//     // USING USER'S ID
//     return db
//       .collection('users')
//       .findOne({ email: email })
//       .then(user => {
//         console.log('%% user.js findByEmail() :: FOUND BELOW USER')
//         console.log(typeof user)
//         console.log(user)

//         //console.log('%% user.js findByEmail() :: user.save IS ...')
//         //console.log(user.save)
//         return user
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }


//   static findByToken(tokenData) {
//     const db = getDB()

//     const resetToken = tokenData.resetToken
//     const resetTokenExpiration = tokenData.resetTokenExpiration

//     console.log('%% user.js findByToken() :: resetToken')
//     console.log(resetToken)
//     console.log('%% user.js findByToken() :: resetTokenExpiration')
//     console.log(resetTokenExpiration)


//     // FIND USER FROM USERS COLLECTION
//     // USING USER'S ID
//     return db
//       .collection('users')
//       .findOne({ resetToken: resetToken,  resetTokenExpiration: resetTokenExpiration})
//       .then(user => {
//         console.log('%% user.js findByToken() :: FOUND BELOW USER')
//         console.log(typeof user)
//         console.log(user)

//         //console.log('%% user.js findByEmail() :: user.save IS ...')
//         //console.log(user.save)
//         return user
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }




//   static checkUniqueByEmail(email) {
//     const db = getDB();

//     return db
//       .collection('users')
//       .findOne({ email: email })
//       .then(user => {
//         if (!user) return true
//         else return false
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }



// }


// module.exports = User
