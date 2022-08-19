# Sanctions Screener

## Deployment
gcloud beta functions deploy fetch-un-sanctions \
--gen2 \
--runtime nodejs16 \
--trigger-topic fetch-un  \
--entry-point fetchUN \
--source . \
--allow-unauthenticated

## Test in the cloud:
gcloud pubsub topics publish  --message 'MyMessage'
