const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const createUserTable = require("./models/User");
const createUserRoleTable = require("./models/UserRole");
const createDepartmentTable = require("./models/Department");
const addConstraints = require("./models/constraints");

const app = express();
app.use(cors());
app.use(express.json());

db.connect().then(async() => {
    console.log("Connected to the database");
    await createUserTable();
    console.log("User table created or already exists");
    await createUserRoleTable();
    console.log("UserRole table created or already exists");
    await createDepartmentTable();
    console.log("Department table created or already exists");
    await addConstraints();
    console.log("Constraints added or already exist");
})
.catch((err) => {
    console.error("Error connecting to the database", err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})