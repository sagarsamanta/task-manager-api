const mongoose = require("mongoose");
const mongo_connect =async (req,res,next) => {
 await mongoose.connect(
    process.env.DATABASE_CONNECTION_URL,
    { useNewUrlParser: true },
    (error, responce) => {
      if (error) {
        return console.log("Unable to connect ot database server!");

      }
      next()
    }
  );
}
module.exports=mongo_connect



