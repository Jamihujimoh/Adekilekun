exports.handler = async function(event, context) {
  const fetch = (await import('node-fetch')).default;

  try {
    const body = JSON.parse(event.body);
    const message = body.message;
    const callback_query = body.callback_query;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    console.log("Telegram function triggered");
    console.log("Request body:", body);

    // Handle /start command
    if (message && message.text === "/start") {
      const welcomeMessage = `
🎉 *Welcome to SpotySport!* 🚀

Hello, and thank you for joining our community! SpotySport is your ultimate hub for all things sports, updates, tips, and insights. Our platform is designed for passionate fans, aspiring athletes, and curious explorers alike, offering resources, guidance, and interactive ways to engage with sports content.

Here’s how to get started:
1️⃣ Explore the latest news and updates in sports.
2️⃣ Learn about our mission and community.
3️⃣ Reach out for support or guidance anytime.
4️⃣ Discover tips and insights to improve your sports knowledge.
5️⃣ Engage with interactive features that make following sports fun.
6️⃣ Connect with other enthusiasts and share your experiences.

Your journey is interactive, supportive, and personalized. Click any button below to start exploring SpotySport today! 🌟
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
              ],
              [
                { text: "🌐 Web App", url: "https://spotysport.netlify.app/" }
              ]
            ]
          }
        })
      });
    }

    // Handle button clicks (all internal, except Web App)
    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      let textReply = "";

      switch (callback_query.data) {
        case "home":
          textReply = `
🏠 *Home Page*

Welcome back! SpotySport keeps you updated with the latest sports news, tips, and trending content. Stay informed, explore insights, and enjoy interactive features that make following sports fun and engaging!
          `;
          break;

        case "about":
          textReply = `
ℹ️ *About SpotySport*

SpotySport is a dynamic platform for sports enthusiasts of all levels. Our mission is to provide a one-stop hub where users can stay updated on the latest sports news and scores, discover helpful tips to improve their sports knowledge, explore interactive features that make following sports fun, and connect with a supportive community of fellow fans. Whether you are a casual fan, aspiring athlete, or simply curious about sports, SpotySport offers resources, updates, and engaging content that enhances your sports experience. Our platform aims to foster a community of learning, enjoyment, and connection through sports insights, news, and interactive features.
          `;
          break;

        case "contact":
          textReply = `
📞 *Contact Us*

Need assistance or have a question? Reach out directly:
📱 Phone: 07076994624  
✉️ Email: gnutella1770@gmail.com  

Our team is ready to help you anytime! 💬
          `;
          break;

        case "help":
          textReply = `
❓ *Help & Tips*

Here you can find guidance, FAQs, and tips to make the most out of SpotySport. Learn how to navigate the platform, discover features, and get answers to common questions. Your success and enjoyment are our priority!
          `;
          break;

        default:
          textReply = "⚠️ Invalid option. Please try again.";
      }

      // Send the response message for the button
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: textReply,
          parse_mode: "Markdown"
        })
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
};
