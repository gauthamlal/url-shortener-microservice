let port = process.env.PORT || 3000;

const dns = require('dns');

const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MLAB_URI, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
let Schema = mongoose.Schema;

const app = express();
app.use(cors());
app.use('/public', express.static(__dirname+'/public'));
app.use(express.urlencoded({extended:true}));

let counterSchema = new Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0}
});

let Counter =  mongoose.model('counter', counterSchema, 'counter');

let urlSchema = new Schema({
  url: {type: String, unique: true},
  urlID: {type: Number, required: true, default: 0}
});

let Url = mongoose.model('Url', urlSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/shorturl/new', (req, res) => {
  let shortenedUrl = req.body.url;
  shortenedUrl = shortenedUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
  dns.lookup(shortenedUrl, (err, address, family) => {
    if (err) {
      res.json({
        "error": "invalid URL"
      });
    } else {
      Counter.findOneAndUpdate({_id: 'entityid'}, {$inc: {seq: 1}}, (err, counter) => {
        if (err) {
          res.json({
            "error": "invalid URL"
          });
        } else {
          console.log(counter);
          let url = {url: req.body.url, urlID: counter.seq};
          Url.create(url, (err, data) => {
            console.log(err);
            console.log(data);
          });
          res.json({
            "original_url": req.body.url,
            "short_url": counter.seq
          });
        }
      });
    }
  });
});

console.log(process.env.MLAB_URI);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
