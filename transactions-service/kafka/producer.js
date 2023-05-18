const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["pkc-lzvrd.us-west4.gcp.confluent.cloud:9092", "kafka2:9092"],
});

const producer = kafka.producer();

exports.produceMessage = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [{ value: "Hello KafkaJS user!" }],
    });

    await producer.disconnect();
  } catch (e) {
    await producer.disconnect();
    console.log(e, "Kafka error");
  }
};
