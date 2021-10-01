const experess = require("express");
const userRouter = require("../src/routers/user");
const taskRouter = require("../src/routers/task");
require("./db/mongoose");



const app = experess();
const port = process.env.PORT;

app.use(experess.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server running at port " + port);
});




