# hono-cloudflare-sample

- local develop

```bash:
cp -pr .dev.vars.sample .dev.vars
yarn
yarn dev
```

- deploy

```bash:
yarn deploy
# set secret
LINE_CHANNEL_ACCESS_TOKEN=your_value
LINE_CHANNEL_SECRET=your_value
echo $LINE_CHANNEL_ACCESS_TOKEN | yarn wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
echo $LINE_CHANNEL_SECRET | yarn wrangler secret put LINE_CHANNEL_SECRET
```
