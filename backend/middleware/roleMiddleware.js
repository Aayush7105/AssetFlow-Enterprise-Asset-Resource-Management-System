const db = require("../config/db");

const roleMiddleware = (...roles) => {

    return async (req, res, next) => {

        try {

            const userRole = await db.query(
                `
                SELECT role
                FROM user_roles
                WHERE user_id = $1
                `,
                [
                    req.user.id
                ]
            );

            if (userRole.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "Role not assigned."
                });
            }

            const role = userRole.rows[0].role;

            if (!roles.includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized access."
                });
            }

            req.user.role = role;

            next();

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }

    };

};

module.exports = roleMiddleware;