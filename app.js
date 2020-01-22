var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  express = require("express"),
  app = express(),
  mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.Promise = require("bluebird");
 
const url = "mongodb://vikram:vikram1@ds243049.mlab.com:43049/stap";
 
mongoose.connect(url);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const Schema = mongoose.Schema;
app.use(methodOverride("_method"));
 
// -------------- Schemas--------------------
var paragraphSchema = new mongoose.Schema({
  text: String
});
 
var wordSchema = new mongoose.Schema({
  word: String,
  presentIn: [
    {
      para_id: {
        type: Schema.Types.ObjectId,
        ref: "paragraph"
      },
      frequency: Number
    }
  ]
});
 
var Paragraph = mongoose.model("paragraph", paragraphSchema);
var Word = mongoose.model("word", wordSchema);
 
// ------------------- Routes ------------------------
app.get("/", function(req, res) {
  res.redirect("Home");
});
 
app.get("/Home", function(req, res) {
  res.render("Home");
});
 
app.get("/clear", function(req, res) {
  Paragraph.collection.drop();
  Word.collection.drop();
  res.render("Home");
});
 
app.post("/search", function(req, res) {
  var reqBody = req.body;
  var toSearch = reqBody.searchText;
  toSearch = toSearch.toLowerCase();
  Word.findOne({ word: toSearch })
    .populate("presentIn.para_id")
    .exec(function(err, foundWord) {
      if (err || !foundWord) {
        return res.send("No documents found");
      }
      console.log("foundword ", foundWord);
      var texts = foundWord.presentIn.map(para => {
        return { text: para.para_id.text, frequency: para.frequency };
      });
 
      texts.sort(function(a, b) {
        return b.frequency - a.frequency;
      });
 
      console.log(texts);
      res.render("show_paragraphs", { texts: texts });
    });
});
 
app.post("/Home", function(req, res) {
  var reqBody = req.body.word;
  var paragraphs = reqBody.split("\r\n\r\n");
 
  paragraphs.forEach(paragraph => {
    Paragraph.create({ text: paragraph }, function(err, newParagraph) {
      if (err) {
        res.send(err);
      } else {
        var words = paragraph.split(" ");
 
        var obj = {};
       
        words.forEach(word => {
          word = word.toLowerCase();
          if (obj[word] != undefined) {
            obj[word]++;
          } else obj[word] = 1;
        });
 
        for (var key of Object.keys(obj)) {
          var presentIn = {
            para_id: newParagraph._id,
            frequency: obj[key]
          };
 
          var options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          };
 
          Word.findOneAndUpdate(
            { word: key },
            { $push: { presentIn: presentIn } },
            options,
            function(error, success) {
              if (error) {
                return res.send(error);
              }
            }
          );
        }
      }
    });
  });
 
  res.redirect("/Home");
});
 
const port = 5000;
 
app.listen(process.env.PORT || port, function() {
  var date = new Date();
  var time = date.getHours();
  time += ":";
  time += date.getMinutes();
  time += ":";
  time += date.getSeconds();
  console.log("server started at " + time + " at http://localhost:5000");
});
