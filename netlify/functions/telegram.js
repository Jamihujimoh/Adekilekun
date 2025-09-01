import fetch from "node-fetch";

export default async function handler(req, res) {
  console.log("Telegram function triggered"); // Debug: function called
  console.log("Request body:", req.body);     // Debug: see what Telegram sends

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message, callback_query } = req.body;
  const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

  if (!BOT_TOKEN) {
    console.log("No BOT_TOKEN found!");
    return res.status(500).json({ error: "No BOT_TOKEN set in environment variables" });
  }

  const chatId = message ? message.chat.id : callback_query ? callback_query.message.chat.id : null;
  if (!chatId) {
    console.log("No chat ID found in request");
    return res.status(400).json({ error: "No chat ID" });
  }

  // Send typing indicator
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action: "typing" })
    });
  } catch (err) {
    console.log("Error sending typing:", err);
  }

  // Handle /start command
  if (message && message.text === "/start") {
    const welcomeMessage = `
🎉 *Welcome to SpotySport!*

Hello! SpotySport is your hub for all things sports. Explore news, tips, insights, and fun interactive tools. Whether you are a fan, athlete, or curious explorer, SpotySport is designed to keep you informed and inspired. 🏅

Click any button below to get started!
    `;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeMessage,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🏠 Home", callback_data: "home" },
                { text: "ℹ️ About Us", callback_data: "about" }
              ],
              [
                { text: "📞 Contact", callback_data: "contact" },
                { text: "❓ Help", callback_data: "help" }
              ],
              [
                { text: "🌐 Open SpotySport", web_app: { url: "https://spotysport.netlify.app/" } }
              ]
            ]
          }
        })
      });
      console.log("Welcome message sent successfully");
    } catch (err) {
      console.log("Error sending welcome message:", err);
    }
  }

  // Handle button presses
  if (callback_query) {
    let textReply = "";
    switch (callback_query.data) {
      case "home":
        textReply = "🏠 *Home Page*\nExplore trending sports updates and interactive content!";
        break;
      case "about":
        textReply = "ℹ️ *About SpotySport*\nWe provide sports news, tips, and community tools for fans and athletes!";
        break;
      case "contact":
        textReply = "📞 *Contact Us*\nPhone: 07076994624\nEmail: gnutella1770@gmail.com";
        break;
      case "help":
        textReply = "❓ *Help & Tips*\nLearn how to navigate SpotySport, access tips, and stay updated!";
        break;
      default:
        textReply = "⚠️ Invalid option";
    }

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: textReply,
          parse_mode: "Markdown"
        })
      });
      console.log(`Reply sent for button: ${callback_query.data}`);
    } catch (err) {
      console.log("Error sending button reply:", err);
    }
  }

  return res.status(200).json({ ok: true });
}
