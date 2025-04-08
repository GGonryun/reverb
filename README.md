<img src="/assets/reverb-full.png" alt="reverb logo" width="200"/>

# Reverb

A slack bot for collecting and sharing feedback with members of your team.

## Deploy

```
REGION=
PROJECT_ID=
BOT_TOKEN=
CLIENT_SIGNING_SECRET=

gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com

echo -n $SLACK_SIGNING_SECRET | gcloud secrets create slack-signing-secret \
  --replication-policy automatic \
  --data-file -

echo -n $SLACK_CLIENT_ID | gcloud secrets create slack-client-id \
  --replication-policy automatic \
  --data-file -

echo -n $SLACK_CLIENT_SECRET | gcloud secrets create slack-client-secret \
  --replication-policy automatic \
  --data-file -

echo -n $SLACK_STATE_SECRET | gcloud secrets create slack-state-secret \
  --replication-policy automatic \
  --data-file -

gcloud run deploy reverb \
  --source . \
  --platform managed \
  --region $REGION \
  --set-env-vars PROJECT_ID=$PROJECT_ID \
  --allow-unauthenticated
```

## Bibliography

- [Build a Slack Bot](https://codelabs.developers.google.com/codelabs/cloud-slack-bot#0)
- [Block Kit Builder](https://app.slack.com/block-kit-builder/)
- [Adding OAuth to your Slack app](https://tools.slack.dev/bolt-js/concepts/authenticating-oauth)
