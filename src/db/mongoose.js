// const mongoose = require("mongoose");
// mongoose.connect(
//   // process.env.DATABASE_CONNECTION_URL,
//   'mongodb+srv://taskapp:Sagar@12345@cluster0.l7xrb.mongodb.net/task-manager-api?retryWrites=true',
//     { useNewUrlParser: true },
//   (error, responce) => {
//     if (error) {
//       return console.log("Unable to connect ot database server!");
      
//     }
//   }
// );

const mongoose = require("mongoose");
  const mongo=async()=>{ 
    await mongoose.connect(
  // process.env.DATABASE_CONNECTION_URL,
  'mongodb+srv://taskapp:Sagar@12345@cluster0.l7xrb.mongodb.net/task-manager-api?retryWrites=true',
    { useNewUrlParser: true },
  (error, responce) => {
    if (error) {
      return console.log("Unable to connect ot database server!");
      
    }
    console.log('database connect')
  }
);
  }
   module.exports=mongo




