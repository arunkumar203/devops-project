//index.js
// mongodb+srv://sathwiknarkedimilli29:root@cluster0.gyekfu2.mongodb.net/
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const path = require('path');

connectToMongo();

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

app.get('/health', (req, res) => {
  res.status(200).send('Backend is up and running');
});

// available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/course"));
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'build', 'index.html')); });
app.listen(port, () => {
  console.log(`Example app backend listening on port ${port}`);
});
