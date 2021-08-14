const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path")
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");


const app = express();
dotenv.config();
app.use("/images", express.static(path.join(__dirname, "/images")))

//database connection
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmy6m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    }
)
.then(console.log("database connected"))
.catch(err=> console.log(err));


//image upload
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "images")
    },
    filename:(req, file, cb)=>{
        cb(null, req.body.name)
    }
})

const upload = multer({storage: storage})

app.post("/api/upload", upload.single("file"), (req, res)=>{
    res.status(200).json("File has been uploaded successfully")
})
app.get("/", (req, res)=>{
    res.send("Everything is ok")
})
//midleware
app.use(express.json());

// api
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.listen("5000", () => {
    console.log("server is running");
})
