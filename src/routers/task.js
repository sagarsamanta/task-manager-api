const experess = require("express");
const Task = require("../models/task");
const User = require('../models/user')
const authentication = require('../middleware/authentication')
const router = new experess.Router();

router.post("/tasks", authentication, async (req, res) => {
  const user = req.user
  const task = new Task({
    ...req.body,
    owner: user._id
  });

  try {
    const tasks = await task.save()

    res.status(201).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET/tasks?completed=false  // filter data
//GET/tasks?limit=2        // pagination --> limit how many data to show
//GET/tasks?limit=2&skip=1   // pagination-->show first two data and then skip 1 data and show next data here but limit alwas 2
router.get("/tasks", authentication, async (req, res) => {

  try {
    const match = {} //default -->if any matching not given  like tasks?completed=false
    const sort = {}  // default-->if any sorting query not given like tasks?sortBy:createdAt:desc

    // serach value set
    if (req.query.completed) {
      match.completed = req.query.completed === 'true' //in the query we give completed=true/false as string ,you have to convert into boolean ,here we check ==='true' if right then give boolen true otherwise boolean false
    }
    //sort value set
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':')  // we split both sorting id and which way to sort by using ':' and store into 'parts' array
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const user = await User.findById(req.user._id).populate({
      path: 'tasks',
      match: match,
      options: { //pagination
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: sort
      }
    }).exec()

    res.status(200).send(user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/tasks/:id", authentication, async (req, res) => {
  const _id = req.params.id;
  user = req.user
  try {
    const task = await Task.findOne({ _id: _id, owner: user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", authentication, async (req, res) => {
  const _id = req.params.id;
  const updateList = req.body;

  //check valid updates
  const allowUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid updates" });
  }

  //original work if validate upadtes send
  try {
    const task = await Task.findOne({ _id: _id, owner: req.user._id });
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    task.save();

    //  const task=await Task.findByIdAndUpdate(_id,updateList,{new:true,runValidators:true})

    if (!task) {
      return res.status(400).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", authentication, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
