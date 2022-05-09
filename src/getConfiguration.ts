import * as dotenv from "dotenv";

type Configuration = {
  connectionString: string;
  topic: string;
  subscription: string;
};

dotenv.config();

export const getConfiguration = (): Configuration => {
  const connectionString = process.env.SERVICEBUS_CONNECTION_STRING!;
  if (!connectionString)
    throw new Error("env SERVICEBUS_CONNECTION_STRING missing");
  const topic = process.env.TOPIC_NAME!;
  if (!topic) throw new Error("env TOPIC_NAME missing");
  const subscription = process.env.SUBSCRIPTION_NAME!;
  if (!subscription) throw new Error("env SUBSCRIPTION_NAME missing");

  return { connectionString, topic, subscription };
};
