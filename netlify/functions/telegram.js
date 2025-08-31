exports.handler = async function(event, context) {
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    const { message } = body;

    if (message && message.text === "/start") {
      const chatId = message.chat.id;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Open my Netlify app 👇",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Open App",
                  web_app: {
                    url: "https://spotysport.netlify.app/"
                  }
                }
              ]
            ]
          }
        }),
      });
    }

    return {
      statusCode: 200,
      body: "OK"
    };
  }

  return {
    statusCode: 405,
    body: `Method ${event.httpMethod} Not Allowed`
  };
};

