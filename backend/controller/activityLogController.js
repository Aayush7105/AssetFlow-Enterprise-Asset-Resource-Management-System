const db = require("../config/db");
const getAllActivityLogs = async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT

                al.*,

                u.name AS user_name

            FROM activity_logs al

            LEFT JOIN users u
                ON al.user_id = u.id

            ORDER BY al.created_at DESC
            `
        );

        return res.status(200).json({

            success: true,

            count: result.rows.length,

            data: result.rows

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};
const getActivityLogById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await db.query(
            `
            SELECT

                al.*,

                u.name AS user_name,

                u.email

            FROM activity_logs al

            LEFT JOIN users u
                ON al.user_id = u.id

            WHERE al.id = $1
            `,
            [id]
        );

        if(result.rows.length===0){

            return res.status(404).json({

                success:false,

                message:"Activity log not found."

            });

        }

        return res.status(200).json({

            success:true,

            data:result.rows[0]

        });

    } catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};
module.exports = {

    getAllActivityLogs,

    getActivityLogById

};