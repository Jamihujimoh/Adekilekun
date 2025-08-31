export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (message && message.text === "/start") {
      const chatId = message.chat.id;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Open my Next.js app 👇",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Open App",
                  web_app: {
                    url: "https://spotysport.netlify.app/" // Replace with your Next.js URL
                  }
                }
              ]
            ]
          }
        }),
      });
    }

    return res.status(200).send("OK");
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
