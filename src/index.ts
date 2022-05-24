import {delay, ServiceBusMessage, ServiceBusClient } from "@azure/service-bus";
import fs from "fs";
import { getConfiguration } from "./getConfiguration";

const { connectionString, topic, subscription } = getConfiguration();
const sbClient = new ServiceBusClient(connectionString);



// output mirrors source queue
const outPath = `dlq-msgs/${sbClient.fullyQualifiedNamespace}/${topic}/${subscription}`;
console.log(`Output Directory:\n${outPath}\n`);
if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

const save = async (
  directory: string,
  key: string,
  body: any
): Promise<void> => {
  const now = Date.now();
  await fs.promises.writeFile(
    `${directory}/${now}.${key}.json`,
    JSON.stringify({
      error: `${body.deadLetterReason ?? "Unknown Error"}: ${
        body.deadLetterErrorDescription ?? "No Description"
      }`,
      body: body.body?.eventData ?? "",
    })
  );
};

async function downloadDLQMessages() {
  // If connecting to a subscription's dead letter queue you can use the createReceiver(topicName, subscriptionName) overload
  console.log(`topic: ${topic}`);
  console.log(`subscription: ${subscription}`);
  const receiver = sbClient.createReceiver(topic, subscription, {
    subQueueType: "deadLetter",
  });
  let count = 0;

  let messages = await receiver.receiveMessages(100, { maxWaitTimeInMs: 500 });
  console.log("Got the messages");
  while (messages.length > 0) {
    count += messages.length;
    let promises: Array<Promise<any>> = [];
    messages.forEach(async (message) => {
      // Do something with the message retrieved from DLQ
      console.log(`Received message: ${message.body}`);
      promises.push(
        save(outPath, message.sequenceNumber?.toString() ?? "0", message)
      );
      // Mark message as complete/processed.
      promises.push(receiver.completeMessage(message));
    });

    await Promise.allSettled(promises);
    messages = await receiver.receiveMessages(100, { maxWaitTimeInMs: 500 });
  }

  console.log(`Processed:\n${count} message(s).`);
  await receiver.close();
}

async function deleteMessageFromSubscription() {
        var batchSize = 1000;
        const receiver = sbClient.createReceiver(topic,subscription);
        var messages = await receiver.receiveMessages(batchSize, { maxWaitTimeInMs: batchSize })
        while (messages.length > 0) {
            var promises = [];
          for(let i = 0; i < messages.length; i++) {
            promises.push(receiver.completeMessage(messages[i]));       
          }
          await Promise.allSettled(promises);

          var messages = await receiver.receiveMessages(batchSize, { maxWaitTimeInMs: batchSize })
        }
        await receiver.close();	
}

async function main() {
  try {
    //Delete all messgages from a subscription's dead letter queue
    //await downloadDLQMessages();
    //Delete all messages from a subscription
    // await deleteMessageFromSubscription();
  } finally {
    await sbClient.close();
  }
}

main().catch((err) => {
  console.log("Moving from DLQ Sample - Error occurred: ", err);
  process.exit(1);
});
