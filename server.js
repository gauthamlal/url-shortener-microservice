let port = process.env.PORT || 3000;

const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

mongoose.connect(process.env.MLAB_URI);

console.log(process.env.MLAB_URI);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
