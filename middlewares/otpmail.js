const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");

const router = express.Router();
router.use(bodyParser.json());

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sanjuga9099@gmail.com", // Your Gmail email address
    pass: "sanju@1234", // Your Gmail password
  },
});

// Endpoint to send OTP
router.post("/sendOTP", (req, res) => {
  const { email } = req.body;
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  const mailOptions = {
    from: "your_email@gmail.com", // Sender's email address
    to: email, // Recipient's email address
    subject: "OTP Verification",
    text: `Your OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    }
  });
});

module.exports = router;
