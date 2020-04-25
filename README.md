# slacksave-bolt

Save all Slack messages into MongoDB using Bolt (and Bull.js, in the future)

## Installation

```
git clone git@github.com:hieptuanle/slacksave-bolt.git
cd slacksave-bolt
yarn install
```

Create an `.env` file

```
SLACK_SIGNING_SECRET=<YOUR SLACK SIGNING SECRET>
SLACK_BOT_TOKEN=<YOUR SLACK BOT TOKEN>
MONGODB_URI=<YOUR MONGODB URI>
DATABASE_NAME=<YOUR DATABASE NAME>
PORT=<YOUR PORT>
```

Run it

```
yarn start
```

Use `ngrok` to tunnel request to your app

```
ngrok http <YOUR PORT>
```

Remember to edit your Request URL on **Slack's Event Subscriptions** page. Link below:

```
https://api.slack.com/apps/<YOUR APP ID>/event-subscriptions
```

and then subcribe to appropriate events. I recommend these:

- app_mention
- message.channels
- message.groups
- message.im
- message.mpim

That's it!
