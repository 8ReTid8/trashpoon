import express from 'express';
import mqtt from 'mqtt';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 5175; // New API port

app.use(cors());
app.use(bodyParser.json());

const options = {
  clientId: 'd1bf2950-fc04-47ee-afe7-4dca3d0c14cd',
  username: 'im8EvkKhNjCwiaNg3hMopSTBMQUp2431',
  password: 'JDhRno2MQQGsyAy2wWSdRcQuYkZwgHdN'
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
  res.status(200).json({ topic, message });
});

app.listen(port, () => {
  console.log(`Response API listening at http://localhost:${port}`);
});
