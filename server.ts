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
    const results = await Promise.all(
      recipients.map((to) =>
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            subject,
            message: body,
            _captcha: "false",
          }),
        }).then((r) => r.json()),
      ),
    );

    const allOk = results.every((r) => r.success === "true" || r.message);
    if (allOk) {
      res.json({ ok: true });
    } else {
      console.error("FormSubmit errors:", results);
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
