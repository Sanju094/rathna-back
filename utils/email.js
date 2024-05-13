

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sanjuga9099@gmail.com",
        pass: "cihk djyb tjuk bslx"
    }
});

function sendEmail(whome, sub, cont) {
    const message = {
        from: "sanjuga9099@gmail.com",
        to: whome,
        subject: sub,
        text: cont
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            // Handle error
            console.error("Error occurred while sending email:", err);
            return 0;
        } else {
            return 1;
        }
    });
}

module.exports = sendEmail;