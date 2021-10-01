const express = require("express");
const multer = require('multer')
const sharp=require('sharp')
const router = new express.Router();
const User = require("../models/user");
const {sendWellcomeEmail,sendCancelEmail}=require('../emails/account')
const authentication = require("../middleware/authentication");



//sign up
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const users = await user.save();
    sendWellcomeEmail(user.email,user.name)
    const token = await user.generateAuthToken();
    res.status(201).send({ users, token }); // calling send method with object(here object destructure used) which intenall call toJSON function located in models/user.js
  } catch (error) {
    res.status(405).send(error.message);
  }
});
//login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials( //own created function , defination in models/use.js
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token }); //whenever you call send method with object then send method internall call JSON.stringify() method and JSON n=method internall call toJSON() method then what toJSON method return send method send that
    // res.send({user:user.filterObject(),token}) // you can use function also to instead off calling toJSON function in user.js file in models
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//logout from single device
router.post("/users/logout", authentication, async (req, res) => {
  try {
    const user = req.user; // in authetication file we set it
    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
//logout from all login device
router.post("/users/logoutAll", authentication, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
//get details of my
router.get("/users/me", authentication, async (req, res) => {
  // console.log(req.user)
  res.send(req.user);  // calling send method with object which intenall call toJSON function located in models/user.js
});
//update your data
router.patch("/users/me", authentication, async (req, res) => {
  const updateList = req.body;
  const user = req.user
  //for invlid update request handelar
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid updates!" });
  }
  // if validates updates send
  try {
    // const user = await User.findOne(user._id);
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save(); //we use creating method insted of updating ,overwrite the value with upadate value
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
//delete your profie
router.delete("/users/me", authentication, async (req, res) => {
  try {
    const user = req.user; // getting user details from authentication page
    user.remove();
    sendCancelEmail(user.email,user.name)
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return callback(new Error('Only .jpg,.png,.jpeg allowed!'))
    }
    callback(undefined, true)
  }

})
router.post('/users/me/avatar', authentication,upload.single('avatar'), async (req, res) => {
  const user = req.user
  // const avatarFile=req.file.buffer // when you go through upload.single() middle whare there you set the file to req.file.buffer=your image file 
  const buffer= await sharp(req.file.buffer).resize({height:200,width:250}).png().toBuffer()
  user.avatar = buffer
  await user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(500).send({ error: error.message })
})
router.delete('/users/me/avatar',authentication,async (req,res)=>{
  const user=req.user
  user.avatar=undefined
    await user.save()
  res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
  try {
    const user=await User.findById(req.params.id)
  if(!user || !user.avatar){
    throw new Error()
  }
  res.set('Content-Type','image/png')
  res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
})

module.exports = router;
