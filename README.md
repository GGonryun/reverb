# Reverb

<img src="/assets/reverb-full.png" alt="reverb logo" width="200"/>

A slack bot for collecting and sharing feedback with members of your team.

## Deploy

```
gcloud run deploy reverb \
  --source . \
  --platform managed \
  --region $REGION \
  --set-env-vars PROJECT_ID=$PROJECT_ID \
  --allow-unauthenticated
```

## Bibliography

- [Build a Slack Bot](https://codelabs.developers.google.com/codelabs/cloud-slack-bot#0)
