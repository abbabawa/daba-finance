
const { Kafka } = require("kafkajs");

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: "qa-topic",
  brokers: ["pkc-lzvrd.us-west4.gcp.confluent.cloud:9092"],
  ssl: true,
  logLevel: 2,
  sasl: {
    mechanism: "plain",
    username: "KXM65X6T2N4256BT",
    password:
      "pjD1sUMUbpgbOKYk1+t63SQXkI6/c5B0vg2U/pGPD8jejkOM4SXw1hWdG/sH1/Q/",
  },
});

const producer = kafka.producer();
producer.on("producer.connect", () => {
  console.log(`KafkaProvider: connected`);
});
producer.on("producer.disconnect", () => {
  console.log(`KafkaProvider: could not connect`);
});
producer.on("producer.network.request_timeout", (payload) => {
  console.log(`KafkaProvider: request timeout ${payload.clientId}`);
});

exports.produceMessage = async (sender) => {
  // Producing
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [
      { key: "key1", value: "A transfer was made by user:"+sender },
    ],
  });
};
