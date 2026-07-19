import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  family: 4,
});

app.post("/api/send-email", async (req, res) => {
  const { name, phone, email, service, date, slot, notes } = req.body;

  if (!name || !phone || !email || !service || !date || !slot) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const subject = `Consultation Request - ${service} - ${date} at ${slot}`;
  const body = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Practice Area: ${service}`,
    `Preferred Date: ${date}`,
    `Time Slot: ${slot}`,
    ``,
    `Case Notes:`,
    notes || "N/A",
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"H&B Booking" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject,
      text: body,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
