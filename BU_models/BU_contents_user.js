// DATABASE ACTION FOR CONTENTS-USER


const mongodb = require('mongodb')
const getDB = require('../database/database.js').getDB

// < OBJECT ID IN MONGO DB >
// https://www.geeksforgeeks.org/what-is-objectid-in-mongodb/
//
// Every document in the collection has an “_id” field
// that is used to uniquely identify the document
//
// ObjectID is a 12-byte Field Of BSON type
//
// BELOW IS FOR TPYE-MATCHING
const ObjectId = mongodb.ObjectId


class ContentsUser {

  // USER WILL HAVE NAME, EMAIL, MATHNODE, ID
  constructor(data, user, id) {
    this.data = data
    this.user = user
    this._id = id
  }


  // FOR SAVING TO DATABASE
  save() {
    const db = getDB();
    return db.collection('contents_user').insertOne(this);
  }


  // UPDATE DOCUMENT
  update() {
    const db = getDB();

    return db
      .collection('contents_user')
      .updateOne(
        { _id: this._id },
        { $set: 
          {
          data: this.data,
          user: this.user
          }
        })
      .catch(err => {
        console.log(err)
      })

  }


  // UPDATE DOCUMENT' TOKEN
  updateToken(tokenData) {
    const db = getDB();

    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: 
          {
            data: this.data,
            user: this.user
          }
        }
      )
      .catch(err => {
        console.log(err)
      })

  }



  // TO FIND THE USER WITH ID
  static findById(userId) {
    const db = getDB();

    // FIND USER FROM USERS COLLECTION
    // USING USER'S ID
    return db
      .collection('contents_user')
      .findOne({ _id: new ObjectId(userId) })
      .then(content => {
        console.log('%% contents_user.js findById() :: FOUND BELOW USER')
        console.log(typeof content)
        console.log(content)

        //console.log('%% user.js findById() :: user.save IS ...')
        //console.log(user.save)
        return content
      })
      .catch(err => {
        console.log(err)
      })
  }


  static findByEmail(email) {
    const db = getDB()

    // FIND USER FROM USERS COLLECTION
    // USING USER'S ID
    return db
      .collection('contents_user')
      .findOne({ email: email })
      .then(content => {
        console.log('%% contents_user.js findByEmail() :: FOUND BELOW USER')
        console.log(typeof content)
        console.log(content)

        //console.log('%% user.js findByEmail() :: user.save IS ...')
        //console.log(user.save)
        return content
      })
      .catch(err => {
        console.log(err)
      })
  }


}


module.exports = ContentsUser
