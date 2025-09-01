import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    try {
      console.log("Telegram function triggered");
      console.log("Request body:", req.body);

      if (message && message.text === "/start") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: "Hello! Your bot is now working.",
          }),
        });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
