import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const MAIL_TO = process.env.MAIL_TO || "avocat.hanifi@gmail.com";
const RESEND_KEY = process.env.RESEND_API_KEY;

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
    const recipients = MAIL_TO.split(",").map((r) => r.trim());

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "H&B Booking <onboarding@resend.dev>",
        to: recipients,
        subject,
        text: body,
        reply_to: email,
      }),
    });

    const data = await r.json();

    if (r.ok && data.id) {
      console.log("Email sent:", data.id);
      res.json({ ok: true });
    } else {
      console.error("Resend error:", data);
      res.status(500).json({ error: "Failed to send email" });
    }
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
