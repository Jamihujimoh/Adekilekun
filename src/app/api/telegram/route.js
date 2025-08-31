export async function POST(req) {
  const token = process.env.TELEGRAM_BOT_TOKEN; // set in Netlify environment variables
  const body = await req.json();

  // For debugging: Log received data
  console.log("Received:", body);

  // Extract message text and chat ID
  const chatId = body.message?.chat?.id;
  const text = body.message?.text;

  if (chatId && text) {
    const reply = `You said: ${text}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: reply })
    });
  }

  return new Response(JSON.stringify({
    message: "Telegram API received!",
    data: body
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
