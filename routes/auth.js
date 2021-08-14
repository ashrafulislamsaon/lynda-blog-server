const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

//Register a User
router.post("/register", async(req, res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })
        const user = await newUser.save();
        res.status(200).json(user)

    }catch(err){
        res.status(404).json(err)
    }
})

//Login User
router.post("/login", async(req, res)=>{
    try{
        const user = await User.findOne({ email: req.body.email})
        !user && res.status(402).json("Invalid Info")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(401).json("Invalid Info");

        const { password, ...others} = user._doc;
        res.status(200).json(others)
    }catch(err){
        res.status(401).json(err)
    }
})

module.exports = router;