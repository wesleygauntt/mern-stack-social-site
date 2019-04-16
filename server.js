const express = require('express');
const mongoose = require('mongoose');

const auth = require("./routes/api/auth");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

const db = require('./config/keys.js').mongoURI;

console.log("DB: ", db);

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error connecting to DB: ", err))

app.get('/', (req, res) => res.send('Hit.'));
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}.`))
