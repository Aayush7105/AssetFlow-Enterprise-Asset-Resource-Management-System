const db = require("../config/db");

const getDashboard = async (req, res) => {

    try {

        /* =======================
            Assets KPI
        ======================= */

        const assetStats = await db.query(`
            SELECT

                COUNT(*) AS total_assets,

                COUNT(*) FILTER (
                    WHERE status='AVAILABLE'
                ) AS available_assets,

                COUNT(*) FILTER (
                    WHERE status='ALLOCATED'
                ) AS allocated_assets,

                COUNT(*) FILTER (
                    WHERE status='UNDER_MAINTENANCE'
                ) AS maintenance_assets,

                COUNT(*) FILTER (
                    WHERE status='LOST'
                ) AS lost_assets

            FROM assets
        `);

        /* =======================
            Bookings
        ======================= */

        const bookingStats = await db.query(`
            SELECT COUNT(*) AS active_bookings

            FROM resource_bookings

            WHERE status IN
            ('UPCOMING','ONGOING')
        `);

        /* =======================
            Maintenance
        ======================= */

        const maintenanceStats = await db.query(`
            SELECT COUNT(*) AS pending_maintenance

            FROM maintenance_requests

            WHERE status='PENDING'
        `);

        /* =======================
            Transfer
        ======================= */

        const transferStats = await db.query(`
            SELECT COUNT(*) AS pending_transfer

            FROM transfer_requests

            WHERE status='PENDING'
        `);

        /* =======================
            Audit
        ======================= */

        const auditStats = await db.query(`
            SELECT COUNT(*) AS open_audits

            FROM audit_cycles

            WHERE status='OPEN'
        `);

        /* =======================
            Notification
        ======================= */

        const notificationStats = await db.query(`
            SELECT COUNT(*) AS unread

            FROM notifications

            WHERE user_id=$1

            AND is_read=FALSE
        `,[req.user.id]);

        /* =======================
            Overdue
        ======================= */

        const overdue = await db.query(`
            SELECT COUNT(*) AS overdue

            FROM allocations

            WHERE status='ACTIVE'

            AND expected_return_date<CURRENT_DATE
        `);

        /* =======================
            Recent Activity
        ======================= */

        const recentActivities = await db.query(`
            SELECT

                al.*,

                u.name

            FROM activity_logs al

            LEFT JOIN users u

            ON al.user_id=u.id

            ORDER BY al.created_at DESC

            LIMIT 10
        `);

        /* =======================
            Recent Notifications
        ======================= */

        const notifications = await db.query(`
            SELECT

                id,

                title,

                message,

                is_read,

                created_at

            FROM notifications

            WHERE user_id=$1

            ORDER BY created_at DESC

            LIMIT 5
        `,[req.user.id]);

        /* =======================
            Upcoming Returns
        ======================= */

        const returns = await db.query(`
            SELECT

                a.id,

                ass.asset_tag,

                ass.name,

                a.expected_return_date,

                u.name AS employee

            FROM allocations a

            INNER JOIN assets ass

            ON ass.id=a.asset_id

            INNER JOIN users u

            ON u.id=a.user_id

            WHERE

            a.status='ACTIVE'

            ORDER BY expected_return_date ASC

            LIMIT 10
        `);

        /* =======================
            Today's Bookings
        ======================= */

        const todayBookings = await db.query(`
            SELECT

                rb.id,

                ass.name,

                rb.start_time,

                rb.end_time,

                u.name AS booked_by

            FROM resource_bookings rb

            INNER JOIN assets ass

            ON ass.id=rb.asset_id

            INNER JOIN users u

            ON u.id=rb.user_id

            WHERE DATE(rb.start_time)=CURRENT_DATE

            ORDER BY rb.start_time
        `);

        /* =======================
            Pending Approvals
        ======================= */

        const pendingApprovals = {

            transferRequests:
                Number(
                    transferStats.rows[0].pending_transfer
                ),

            maintenanceRequests:
                Number(
                    maintenanceStats.rows[0].pending_maintenance
                ),

            auditCycles:
                Number(
                    auditStats.rows[0].open_audits
                )

        };

        return res.status(200).json({

            success:true,

            dashboard:{

                kpis:{

                    totalAssets:Number(assetStats.rows[0].total_assets),

                    availableAssets:Number(assetStats.rows[0].available_assets),

                    allocatedAssets:Number(assetStats.rows[0].allocated_assets),

                    maintenanceAssets:Number(assetStats.rows[0].maintenance_assets),

                    lostAssets:Number(assetStats.rows[0].lost_assets),

                    activeBookings:Number(bookingStats.rows[0].active_bookings),

                    overdueReturns:Number(overdue.rows[0].overdue),

                    unreadNotifications:Number(notificationStats.rows[0].unread)

                },

                pendingApprovals,

                recentActivities:recentActivities.rows,

                recentNotifications:notifications.rows,

                upcomingReturns:returns.rows,

                todayBookings:todayBookings.rows

            }

        });

    } catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

module.exports={
    getDashboard
};