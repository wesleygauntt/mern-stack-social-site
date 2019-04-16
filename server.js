const express = require('express');
const mongoose = require('mongoose');

const app = express();

const db = require('./config/keys.js').mongoURI;

console.log("DB: ", db);

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error connecting to DB: ", err))

app.get('/', (req, res) => res.send('Hit.'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}.`))
