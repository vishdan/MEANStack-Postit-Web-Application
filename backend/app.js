const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const Post = require("../backend/models/posts")

const app = express();
mongoose.connect("mongodb://localhost:27017/postit")
  .then(()=>{
    console.log("Connected to Local Database")
  })
  .catch(()=>{
    console.log("Failed")
  })

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added sucessfully'
  })
});

app.use("/api/posts", (req, res, next) => {
  Post.find()
    .then((documents)=>{
      res.status(200).json({
        message: "OK 200",
        posts: documents
      });
    })
});

module.exports = app;
