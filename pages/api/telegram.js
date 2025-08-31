export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message, callback_query } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    try {
      // Handle /start command
      if (message && message.text === "/start") {
        const welcomeMessage = `
🎉 *Welcome to SpotySport!* 🚀

Hello and thank you for joining our community! SpotySport is your hub for all things sports, updates, tips, and insights that empower you to stay informed and inspired.  

Whether you’re a passionate fan, aspiring athlete, or curious explorer, our platform provides resources, guidance, and fun ways to engage. 🏅  

Here’s how you can start your journey with SpotySport:

1️⃣ Explore the latest sports news and updates.  
2️⃣ Learn more about our mission and community.  
3️⃣ Reach out for support or guidance whenever needed.  
4️⃣ Discover tips and insights to improve your sports knowledge.  

Your journey is interactive, supportive, and fully personalized. Click any button below to get started! 🌟
        `;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
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
                ]
              ]
            }
          })
        });
      }

      // Handle button clicks
      if (callback_query) {
        const chatId = callback_query.message.chat.id;
        let textReply = "";
        let urlButton = null;

        switch (callback_query.data) {
          case "home":
            textReply = `
🏠 *Home Page*

Welcome back! Explore our latest sports updates, tips, and trending content. Click the button below to jump straight in! ⚡
            `;
            urlButton = "https://spotysport.netlify.app/";
            break;

          case "about":
            textReply = `
ℹ️ *About SpotySport*

SpotySport is a dynamic web application designed for sports enthusiasts of all levels. 🏅  

Our mission is to provide a one-stop platform where users can:  
- Stay updated with the latest sports news and scores  
- Discover helpful tips and insights to improve their knowledge of sports  
- Explore interactive features and tools that make following sports fun and engaging  
- Connect with a supportive community of fellow sports fans  

Whether you are a casual fan, an aspiring athlete, or just curious, SpotySport gives you access to resources, updates, and interactive content to enhance your sports experience. 🚀
            `;
            urlButton = "https://spotysport.netlify.app/about";
            break;

          case "contact":
            textReply = `
📞 *Contact Us*

Need assistance or have a question? You can reach us directly:

📱 *Phone:* 07076994624  
✉️ *Email:* gnutella1770@gmail.com  

Our team is ready to help you. Feel free to call, message, or email anytime! 💬
            `;
            urlButton = null;
            break;

          case "help":
            textReply = `
❓ *Help & Tips*

Here you can find guidance, FAQs, and tips to make the most out of SpotySport. Your success and enjoyment are our priority! ✨
            `;
            urlButton = "https://spotysport.netlify.app/help";
            break;

          default:
            textReply = "⚠️ Invalid option. Please try again.";
        }

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: textReply,
            parse_mode: "Markdown",
            reply_markup: urlButton
              ? { inline_keyboard: [[{ text: "Open Page", url: urlButton }]] }
              : undefined
          })
        });
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
