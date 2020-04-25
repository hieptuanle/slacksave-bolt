import "dotenv/config";
import { App } from "@slack/bolt";
import { DBClient } from "./db";

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

/* Add functionality here */

(async () => {
  // Start the app
  const dbClient = new DBClient();
  await dbClient.connect();

  const port = process.env.PORT;
  await app.start(port || 3000);

  app.message(async function ({ message, say }) {
    const text = message.text;
    console.log(text);
    await dbClient.collection("messages").insertOne(message);
  });

  console.log(`⚡ Slack Save is running and listen on port ${port}`);
  console.log(
    "Point Slack Events API route to /slack/events to start receive events!"
  );
})();
