const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async ({to, subject, html}) => {
    try {
        const mailOptions = {
            from: `"AssetFlow ERP" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email Sent:", info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Email Error:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};

module.exports = sendMail;