import * as line from '@line/bot-sdk';
import { Hono } from 'hono';

type Bindings = {
  LINE_CHANNEL_ACCESS_TOKEN: string;
  LINE_CHANNEL_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const textEventHandler = async (
  client: line.messagingApi.MessagingApiClient,
  event: line.WebhookEvent,
): Promise<line.MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const { replyToken, message: { text } = {} } = event;

  const response: line.TextMessage = {
    type: 'text',
    text: `${text}と言われましても`,
  };

  const replyMessageRequest: line.messagingApi.ReplyMessageRequest = {
    replyToken: replyToken,
    messages: [response],
  };

  await client.replyMessage(replyMessageRequest);
};

app.post('/webhook', async (c) => {
  const config: line.ClientConfig = {
    channelAccessToken: c.env.LINE_CHANNEL_ACCESS_TOKEN,
  };
  const client = new line.messagingApi.MessagingApiClient(config);
  line.middleware({ channelSecret: c.env.LINE_CHANNEL_SECRET });

  const events: line.WebhookEvent[] = await c.req.json().then((data) => data.events);

  await Promise.all(
    events.map(async (event: line.WebhookEvent) => {
      try {
        await textEventHandler(client, event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        return c.status(500);
      }
    }),
  );

  return c.status(200);
});

export default app;
