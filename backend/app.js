const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const createUserTable = require("./models/User");
const createUserRoleTable = require("./models/UserRole");
const createDepartmentTable = require("./models/Department");
const addConstraints = require("./models/Constraints");
const assetCategoryTable = require("./models/assetCategory");
const assetTable = require("./models/asset");
const allocationTable = require("./models/allocation");
const createAssetCategoryTable = require("./models/AssetCategory");
const createResourceBookingTable = require("./models/ResourceBooking");
const createMaintenanceRequestTable = require("./models/MaintenanceRequest");
const createAuditCycleTable = require("./models/AuditCycle");
const createAuditItemTable = require("./models/AuditItem");
const createNotificationTable = require("./models/Notification");
const createActivityLogTable = require("./models/ActivityLog");
const userRoutes = require("./routes/UserRoutes");
const departmentRoutes = require("./routes/DepartmentRoutes");
const authRoutes = require("./routes/authRoutes");
const assetCategoryRoutes = require("./routes/assetCategoryRoutes");
const assetRoutes = require("./routes/assetRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const resourceBookingRoutes = require("./routes/resourceBookingRoutes");
const transferRequestRoutes = require("./routes/transferRequestRoutes");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/asset-categories", assetCategoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/resource-bookings", resourceBookingRoutes);
app.use("/api/transfer-requests", transferRequestRoutes);
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
    await assetCategoryTable();
    console.log("AssetCategory table created or already exists");
    await assetTable();
    console.log("Asset table created or already exists");
    await allocationTable();
    console.log("Allocation table created or already exists");
    await createAssetCategoryTable();
    console.log("AssetCategory table created or already exists");
    await createResourceBookingTable();
    console.log("ResourceBookings table created or already exists");
    await createMaintenanceRequestTable();
    console.log("Maintenance table created or already exists");
    await createAuditCycleTable();
    console.log("AuditCycle table created or already exists");
    await createAuditItemTable();
    console.log("AuditItem table created or already exists");
    await createNotificationTable();
    console.log("Notification table created or already exists");
    await createActivityLogTable();
    console.log("ActivityLog table created or already exists");
})
.catch((err) => {
    console.error("Error connecting to the database", err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})