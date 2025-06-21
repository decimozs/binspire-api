import nodemailer from "nodemailer";
import env from "../config/env";

const transporter = nodemailer.createTransport({
  host: env?.GMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env?.GMAIL_USER,
    pass: env?.GMAIL_PASS,
  },
});

export default transporter;
