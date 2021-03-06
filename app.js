//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////////Requests targeting ALL articles///////////////////////////////////////

app.route("/articles")
.get(function(req, res) {
  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {

  const article_1 = new Article ({
    title: req.body.title,
    content: req.body.content
  });

  article_1.save(function(err) {
    if (!err) {
      console.log("Successfully added new article!");
    } else {
      console.log(err);
    }
  });
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles!");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////////////Requests targeting a specific article///////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No article matching that title was found!");
    }
  });
})

.put(function(req, res) {
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err) {
      if (!err) {
        res.send("Successfully updated article!");
      }
    }
  );
})

.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if (!err) {
        res.send("Successfully updated the article");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("Successfully deleted the article!");
      } else {
        res.send(err);
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server is tuned in at port 3000");
});
