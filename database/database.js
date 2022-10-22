
const mongoose = require("mongoose")



let mongooseConnection;



const connectToDB = (settings) => {
  

  mongoose
  .connect(process.env.MONGO_URL)
  .then(result => {
    
    //console.log(result.connections)
    //console.log(result.connection.db)
    mongooseConnection = result.connection


    console.log(`MONGOOSE CONNECTION IS OK`)

    settings.callback()


  })
  .catch(err => console.log(`ERROR IS OCCURED WHEN EASTABLISHING CONNECTION !!`))



};




const getDB = () => {

  if(mongooseConnection) {

    return mongooseConnection.db
  }

};





exports.connectToDB = connectToDB

