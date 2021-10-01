const mongoose = require("mongoose");
mongoose.connect(
  process.env.DATABASE_CONNECTION_URL,
    { useNewUrlParser: true },
  (error, responce) => {
    if (error) {
      return console.log("Unable to connect ot database server!");
      
    }
  }
);




