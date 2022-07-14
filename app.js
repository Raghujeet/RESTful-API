const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const request = require('request');

const app = express();

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


//URL connect
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const wikiSchema = {
  title: String,
  content: String
};

const Articale = mongoose.model("Articales", wikiSchema);

app.route("/articles").get(function(req, res) {
    Articale.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Articale({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("sucessfully added.");
      }
    });
  })

  .delete(function(req, res) {
    Articale.deleteMany(function(err) {
      if (!err) {
        res.send("sucessfully deleted items.");
      } else {
        res.send(err);
      }
    });
  });


//////////////////////////////////Requests Targiting A Specific Articale ////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

  Articale.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No Articles matching that title was foumd");
    }
  });
})

.put(function(req,res){
  Articale.update(
    {title:req.params.articleTitle},    // condition
  {title:req.body.title, content:req.body.content  },  //updates
  {overwrite: true},
   function(err){
    if (!err){
      res.send("sucessfully updated recoded");
    }
  });
})

.patch(function(req,res){
  Articale.update(
    {title: req.params.articleTitle}, // condition
    {$set: re.body}, //set value to update
    function(err){
      if (!err){
        res.send("sucessfully update paticuler articale");
      } else {
        res.send(err);
      }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
