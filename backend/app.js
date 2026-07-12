const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const app = express();
app.use(cors());
app.use(express.json());

db.connect().then(() => {
    console.log("Connected to the database");
})
.catch((err) => {
    console.error("Error connecting to the database", err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})