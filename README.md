# AZ Service Bus DLQ Processor

It downloads messages in the DLQ

## Usage

In the root of the repo, create a .env file add the below with the right information.

```
//This requires an access key with "LISTEN" claim.
SERVICEBUS_CONNECTION_STRING="Endpoint=sb://SOME_SERVICE_BUS_NAMESPACE.windows.net/;SharedAccessKeyName=SOME_SHARED_ACCESS_KEY_NAME;SharedAccessKey=SOME_SHARED_ACCESS_KEY"

TOPIC_NAME="SOME_TOPIC_NAME"
SUBSCRIPTION_NAME="SOME_TOPIC_SUBSCRIPTION_NAME"

```

There are two calls in the main function
    //Delete all messgages from a subscription's dead letter queue
    await downloadDLQMessages();
    //Delete all messages from a subscription
    await deleteMessageFromSubscription();

    Both are commented out. You need to enable one based on the need. 'downloadDLQMessages' downloads all messages in the dead letter queue (to a folder dlq-msgs) for the subsription. 'deleteMessageFromSubscription' deletes all messages in the subscription (it does not download it).

To run the program:
npm start


## Unusage

If it's not documented, it's not supported. Please PR any usages not implemented.
