import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create the transporter for Nodemailer
export const transporter = nodemailer.createTransport({
	service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // Use TLS if secure is true
    auth: {
        user: process.env.SMTP_USER, // Your SMTP username
        pass: process.env.SMTP_PASS, // Your SMTP password
    },
});

// Sender details
export const sender = {
    email: "sattvadoshi103@gmail.com",
    name: "Sattva",
};
