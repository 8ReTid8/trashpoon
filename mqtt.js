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
  const { areaId, deviceId } = req.body;
  if (!areaId || !deviceId) {
    return res.status(400).json({ error: 'Missing areaId or deviceId' });
  }

  const topic = `@msg/${areaId}/${deviceId}`;
  client.subscribe(topic, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Subscription failed' });
    }
    console.log(`Subscribed to topic: ${topic}`);
    res.status(200).json({ message: `Subscribed to ${topic}` });
  });
});

app.get('/latest-message', (req, res) => {
  const { areaId, deviceId } = req.query;
  if (!areaId || !deviceId) {
    return res.status(400).json({ error: 'Missing areaId or deviceId' });
  }

  const topic = `@msg/${areaId}/${deviceId}`;
  const message = latestMessages[topic] || 'No messages received yet';
  res.status(200).json({ topic, message });
});

app.listen(port, () => {
  console.log(`Response API listening at http://localhost:${port}`);
});
