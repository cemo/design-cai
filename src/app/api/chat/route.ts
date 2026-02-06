import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  const userText =
    typeof lastMessage.content === "string"
      ? lastMessage.content
      : "something";

  const responseText = `I'm **cai**, your CRM assistant. You said: "${userText}"

I can help you with:
- Analyzing incoming emails for quote requests
- Creating new Contacts and Accounts
- Managing your Opportunity pipeline
- Merging duplicate records

_This is a demo response. Connect me to an AI backend to get real answers._`;

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const partId = crypto.randomUUID();

      writer.write({ type: "text-start", id: partId });

      const words = responseText.split(" ");
      for (const word of words) {
        writer.write({ type: "text-delta", delta: word + " ", id: partId });
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      writer.write({ type: "text-end", id: partId });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
