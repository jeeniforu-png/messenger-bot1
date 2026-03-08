```ts
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

/* VERIFY TOKEN */
const VERIFY_TOKEN = "abc123";

/* PAGE ACCESS TOKEN */
const PAGE_ACCESS_TOKEN = "EAAelfDZA64B0BQ8JL9yYE0EiSMYv5QkZBIR1FRHcNY6ETFNj6oZBQ8sxSUt8ZBc8AhDzq8vsId8ZBKxnGwxSft25rPlZAfEo0wZCEzS4zNtT7txhIgXnMM2npZCxq9bSPzRZBDZBV1nSBbyurtUzRelthl0FelS0lDFiGTkuovdNJz6ZCZBcZAnFUIwEhAS71Isi5n3VtIUNVnQZDZD";

/* WEBHOOK VERIFY */
app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge as string);
  } else {
    res.sendStatus(403);
  }
});

/* RECEIVE MESSAGE */
app.post("/webhook", async (req: Request, res: Response) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const text = webhookEvent.message.text;

        await sendMessage(senderId, "You said: " + text);
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

/* SEND MESSAGE */
async function sendMessage(senderId: string, text: string) {
  await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text: text },
    }),
  });
}

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
