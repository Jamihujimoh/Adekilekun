export async function POST(req) {
  const token = process.env.TELEGRAM_BOT_TOKEN; // set in Netlify
  const body = await req.json();

  // Debugging: Log Telegram update
  console.log("Received:", body);

  const chatId = body.message?.chat?.id;
  const text = body.message?.text;

  if (chatId && text) {
    let reply;

    // Handle commands
    if (text === "/start") {
      reply = "👋 Welcome! Send me a message and I'll echo it back.";
    } else if (text === "/help") {
      reply = "Here are the commands:\n/start - start the bot\n/help - show this help\n(any other text will be echoed)";
    } else {
      reply = `You said: ${text}`;
    }

    // Send reply to Telegram
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
      }),
    });
  }

  return new Response(
    JSON.stringify({
      message: "Telegram API received!",
      data: body,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
