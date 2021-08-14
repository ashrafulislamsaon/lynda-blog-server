const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(401).json(err)
    }
})

// Update Post
router.put("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.username === req.body.username){
            try{
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                    $set: req.body
                },{new: true})
                res.status(200).json(updatedPost)
            }catch(err){
                res.status(500).json(err)
            }
        }else{
            res.status(404).json("You can't update this post")
        }
    }catch(err){
        res.status(404).json(err)
    }
})
// Delete Post
router.delete("/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.username === req.body.username){
            try{
                await post.deleteOne();
                res.status(200).json("Post has been deleted")
            }catch(err){
                res.status(404).json(err)
            }
        }else{
            res.status(401).json("This post doesn't belongs to you")
        }
    }catch(err){
        res.status(500).json(err)
    }
})
// Get a post
router.get("/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})
// Get all post
router.get("/", async(req, res)=>{
    const username = req.query.user;
    const categoryName = req.query.category;
    try{
        let posts;
        if(username){
            posts = await Post.find({username})
        }else if(categoryName){
            posts = await Post.find({categories:{
                $in:[ categoryName]
            }})
        }else{
            posts = await Post.find()
        }
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
})
module.exports = router;