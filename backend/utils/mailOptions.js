const welcomeMail = (name, email, password) => {
    return {
        subject: "Welcome to AssetFlow ERP",

        html: `
            <div style="font-family: Arial, sans-serif; padding:20px">

                <h2>Welcome to AssetFlow ERP </h2>

                <p>Hello <b>${name}</b>,</p>

                <p>Your account has been created successfully.</p>

                <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse;">
                    <tr>
                        <td><b>Email</b></td>
                        <td>${email}</td>
                    </tr>

                    <tr>
                        <td><b>Temporary Password</b></td>
                        <td>${password}</td>
                    </tr>
                </table>

                <br>

                <p>
                    Please login using the above credentials and
                    change your password immediately.
                </p>

                <br>

                <p>
                    Regards,
                    <br>
                    <b>AssetFlow Team</b>
                </p>

            </div>
        `
    };
};

module.exports = {
    welcomeMail
};