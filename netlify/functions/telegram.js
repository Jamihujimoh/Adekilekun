exports.handler = async function(event, context) {
  const fetch = (await import('node-fetch')).default;

  try {
    const body = JSON.parse(event.body);
    const message = body.message;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    console.log("Telegram function triggered");
    console.log("Request body:", body);

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

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
