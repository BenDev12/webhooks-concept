const Client = require("node-rest-client").Client;
const client = new Client();

const redis = require("redis"),
  subscriber = redis.createClient();
subscriber.subscribe("webhooks");
const subscription = () => {
  subscriber.on("message", (channel, message) => {
    console.log("Message " + message + " from " + channel + " wake up!");
    return message;
  });
};
subscription();
const sendWbehook = async () => {
  try {
    const countResult = {
      countTime: 400,
      Job_name: "sending varification",
    };
    for (const property in countResult) {
      if ((property.indexOf[1] = 400)) {
        client.post(
          "http://localhost:4040/webhook",
          countResult,
          (respons, error) => {
            if (error) console.log("failing");
            return respons;
          }
        );
      }
    }
  } catch (error) {
    console.log("failed");
  }
};
sendWbehook();
