# AZ Service Bus DLQ Processor

It downloads messages in the DLQ

## Usage

In the root of the repo, set the required envs and run `npm start`

```
SERVICEBUS_CONNECTION_STRING="Endpoint=sb://SOME_SERVICE_BUS_NAMESPACE.windows.net/;SharedAccessKeyName=SOME_SHARED_ACCESS_KEY_NAME;SharedAccessKey=SOME_SHARED_ACCESS_KEY" \
TOPIC_NAME="SOME_TOPIC_NAME" \
SUBSCRIPTION_NAME="SOME_TOPIC_SUBSCRIPTION_NAME" \
npm start
```

This requires an access key with "LISTEN" claim.

## Unusage

If it's not documented, it's not supported. Please PR any usages not implemented.
