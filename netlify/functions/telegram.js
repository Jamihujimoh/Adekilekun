export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message, callback_query } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    try {
      // Show typing action before sending message
      const sendTyping = async (chatId, duration = 1500) => {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            action: "typing"
          })
        });
        // Wait before sending the actual message
        await new Promise((resolve) => setTimeout(resolve, duration));
      };

      const sendMessageWithNavigation = async (chatId, text) => {
        await sendTyping(chatId); // Show typing indicator
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
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
      };

      // Determine chatId
      const chatId = message ? message.chat.id : callback_query ? callback_query.message.chat.id : null;
      if (!chatId) return res.status(400).json({ ok: false, error: "No chat ID found" });

      // Handle /start or "Back to Start"
      if ((message && message.text === "/start") || (callback_query && callback_query.data === "start")) {
        const welcomeMessage = `
🎉 *Welcome to SpotySport!* 🚀

Hello, sports enthusiasts! SpotySport is your ultimate hub for all things sports, designed to keep you informed, inspired, and engaged. Whether you're a passionate fan, an aspiring athlete, or just curious, we've got you covered! 🏅

✨ *What you can do here:*  
- 📰 Explore the latest sports news and live updates  
- 🎯 Access expert tips and practical guides  
- 🤝 Join an interactive community of fellow enthusiasts  
- 🎥 Enjoy videos, tutorials, and highlights  
- 📊 Stay ahead with stats, scores, and trends  

Engage, explore, and enjoy a seamless interface that brings the best of sports right to your fingertips. Thank you for joining SpotySport — together, let’s make your sports experience more exciting, informative, and fun than ever before! 🌟
        `;
        await sendMessageWithNavigation(chatId, welcomeMessage);
      }

      // Handle other callback buttons
      if (callback_query && callback_query.data !== "start") {
        let textReply = "";

        switch (callback_query.data) {
          case "home":
            textReply = `
🏠 *Home Page*

Welcome back! Explore trending sports news, expert insights, and tips that keep you ahead of the game. ⚡  

🗂️ *Features:*  
- Latest updates on teams and players  
- Highlights and live scores  
- Interactive tips and articles  
- Personalized sports content  

Dive in and enjoy the world of sports at your fingertips! 🏆
            `;
            break;

          case "about":
            textReply = `
ℹ️ *About SpotySport*

SpotySport is a comprehensive platform connecting fans, athletes, and enthusiasts with up-to-date sports news, insights, and interactive tools. 🏅  

📌 *Our Mission:*  
- Provide a centralized hub for news, tips, and guides  
- Foster a community of engaged sports lovers  
- Deliver interactive and educational experiences  
- Keep users informed with live scores and trending updates  
- Encourage sharing and engagement across the platform  

Whether following your favorite teams, improving skills, or staying informed, SpotySport provides a seamless, engaging, and enjoyable experience for everyone! 🚀
            `;
            break;

          case "contact":
            textReply = `
📞 *Contact Us*

Need help or have questions? Our team is ready to assist! 💬  

📱 *Phone:* 07076994624  
✉️ *Email:* gnutella1770@gmail.com  

Reach out anytime — your feedback and inquiries are always welcome!
            `;
            break;

          case "help":
            textReply = `
❓ *Help & Tips*

Maximize your SpotySport experience with our guidance:  

- 📌 Learn how to navigate the platform  
- 📝 Access tips and tutorials  
- 📰 Stay updated with news and insights  
- 💡 Explore interactive tools and features  

Our support team is available to assist whenever needed. Enjoy a smooth, engaging, and interactive sports experience! ✨
            `;
            break;

          default:
            textReply = "⚠️ Invalid option. Please try again.";
        }

        await sendMessageWithNavigation(chatId, textReply);
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Failed to handle message" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
