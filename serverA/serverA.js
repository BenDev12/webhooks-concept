const express = require("express");
const fs = require("fs");
const Queue = require("bull");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();
const PORT = process.env.PORT || 4040;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const publisher = redis.createClient();

const countJob = {
  count_to: 700,
  response_type: "webhook",
};

// new worker
const newJob = new Queue("work", REDIS_URL);
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
    const countJobs = [
      {
        count_to: 700,
        response_type: "webhook",
      },
      {
        count_to: 400,
        response_type: "job queue",
      },
    ];
    if (countJobs.some((job) => job.response_type == "webhook")) {
      countJobs.push({ webhook_url: "http://localhost:4040/webhook" });
      publisher.publish("webhooks", JSON.stringify(countJobs));
      return res.json({ message: "status_pending" });
    } else {
      console.log("false");
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
