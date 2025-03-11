import express from 'express';
import mqtt from 'mqtt';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 5175; // New API port

app.use(cors());
app.use(bodyParser.json());

const options = {
  clientId: "fb21da34-f7b0-4719-8c62-7372a12c35b7",
  username: "yYfeyi9TUkx71C6wwzM1P37i5cg31WPN",
  password: "kPE1jvLfBwcoTES9HTo2ZsMW5SneEQ97"
};

const client = mqtt.connect('mqtt://broker.netpie.io:1883', options);

client.on('connect', () => {
  console.log('Connected to MQTT broker for response API');
});

let latestMessages = {}; // Store latest messages per topic

client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`);
  latestMessages[topic] = message.toString();
});

app.post('/subscribe', (req, res) => {
  const { areaName, deviceName } = req.body;
  if (!areaName || !deviceName) {
    return res.status(400).json({ error: 'Missing areaName or deviceName' });
  }

  const topic = `@msg/${areaName}/${deviceName}`;
  console.log(topic)
  client.subscribe(topic, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Subscription failed' });
    }
    console.log(`Subscribed to topic: ${topic}`);
    res.status(200).json({ message: `Subscribed to ${topic}` });
  });
});

app.post('/publish', (req, res) => {
  const { areaName, deviceName, action } = req.body;
  if (!areaName || !deviceName || !action) {
    return res.status(400).json({ error: 'Missing areaName, deviceName or action' });
  }

  const topic = `@msg/${areaName}/${deviceName}`;
  client.publish(topic, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Subscription failed' });
    }
    console.log(`Subscribed to topic: ${topic}`);
    res.status(200).json({ message: `Subscribed to ${topic}` });
  });
});

app.get('/latest-message', (req, res) => {
  const { areaName, deviceName } = req.query;
  if (!areaName || !deviceName) {
    return res.status(400).json({ error: 'Missing areaName or deviceName' });
  }

  const topic = `@msg/${areaName}/${deviceName}`;
  const message = latestMessages[topic] || 'No messages received yet';

  if (message !== "No messages received yet") {

    const saveMSG = JSON.parse(message).data
    saveLog(saveMSG.capacity, saveMSG.status, deviceName)
  }
  res.status(200).json({ topic, message });
});

app.listen(port, () => {
  console.log(`Response API listening at http://localhost:${port}`);
});


function saveLog(capacity, status, deviceName) {
  fetch("http://localhost:3000/api/saveLog", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      capacity: convertToPercent(capacity),
      status,
      deviceName,
    }),
  })
}



function convertToPercent(capacity) {
  const MAX_CAPA = 320;
  const MIN_CAPA = 90;
  const raw_value = (100 - ((capacity - MIN_CAPA) / (MAX_CAPA - MIN_CAPA)) * 100);
  return Math.max(0, Math.min(100, raw_value));
} 