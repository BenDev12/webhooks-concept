const express = require("express");
const fs = require("fs");
const Queue = require("bull");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();
const PORT = process.env.PORT || 4040;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const publisher = redis.createClient();

// new worker
const newJoby = new Queue("work", REDIS_URL);
// functions
const getNotification = async (req, res, next) => {
  try {
    const countResult = req.body;
    const file = fs.open("Results.txt", countResult, () => {
      console.log(file);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const acceptJobs = async (req, res, next) => {
  try {
    const countJob = {
      count_to: 700,
      response_type: "webhook",
    };
    if (countJob.response_type === "webhook") {
      console.log("this job response type is a webhook");
      publisher.publish("webhooks", JSON.stringify(countJob));
      res.json({ message: "pending" });
    } else {
      console.log("this is job response type is not a webhook");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//  body parser
app.use(bodyParser.json());
// API routes
app.post("/webhook", getNotification);
app.post("/intiate-job", acceptJobs);

app.listen(PORT, console.log(`server is running on port ${PORT} `));
