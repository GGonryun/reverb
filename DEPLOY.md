# Deploying to Google Cloud Run

```bash
SLACK_SIGNING_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_STATE_SECRET=
REGION=
PROJECT_ID=

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
