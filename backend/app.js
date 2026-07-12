const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const createUserTable = require("./models/User");
const createUserRoleTable = require("./models/UserRole");
const createDepartmentTable = require("./models/Department");
const addConstraints = require("./models/constraints");
const createAssetCategoryTable = require("./models/AssetCategory");
const createAssetTable = require("./models/Asset");
const createAllocationTable = require("./models/Allocation");
const createResourceBookingTable = require("./models/ResourceBooking");
const createMaintenanceRequestTable = require("./models/MaintenanceRequest");
const createAuditCycleTable = require("./models/AuditCycle");
const createAuditItemTable = require("./models/AuditItem");
const createNotificationTable = require("./models/Notification");
const createActivityLogTable = require("./models/ActivityLog");
const userRoutes = require("./routes/UserRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const authRoutes = require("./routes/authRoutes");
const assetCategoryRoutes = require("./routes/assetCategoryRoutes");
const assetRoutes = require("./routes/assetRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const resourceBookingRoutes = require("./routes/resourceBookingRoutes");    
const transferRequestRoutes = require("./routes/transferRequestRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const auditRoutes = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "AssetFlow API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/asset-categories", assetCategoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/resource-bookings", resourceBookingRoutes);
app.use("/api/transfer-requests", transferRequestRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/audits", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity-logs", activityLogRoutes);
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
    await createAssetCategoryTable();
    console.log("AssetCategory table created or already exists");
    await createAssetTable();
    console.log("Asset table created or already exists");
    await createAllocationTable();
    console.log("Allocation table created or already exists");
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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
