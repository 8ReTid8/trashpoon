import express from 'express';
import mqtt from 'mqtt';
import bodyParser from 'body-parser';
import cors from 'cors'; // เพิ่ม CORS


// สร้าง instance ของ Express app
const app = express();
const port = 5174;

app.use(cors()); // เปิดใช้งาน CORS

// กำหนดค่าเชื่อมต่อ MQTT
// const options = {
//   clientId: 'fb21da34-f7b0-4719-8c62-7372a12c35b7', // กำหนด Client ID
//   username: 'yYfeyi9TUkx71C6wwzM1P37i5cg31WPN', // ชื่อผู้ใช้
//   password: 'kPE1jvLfBwcoTES9HTo2ZsMW5SneEQ97' // รหัสผ่าน
// };

const options = {
  clientId: 'd1bf2950-fc04-47ee-afe7-4dca3d0c14cd', // กำหนด Client ID
  username: 'im8EvkKhNjCwiaNg3hMopSTBMQUp2431', // ชื่อผู้ใช้
  password: 'JDhRno2MQQGsyAy2wWSdRcQuYkZwgHdN' // รหัสผ่าน
};
// เชื่อมต่อกับ MQTT broker
const client = mqtt.connect('mqtt://broker.netpie.io:1883', options);

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to topic
  client.subscribe('@msg/d1/status', (err) => {
    if (!err) {
      console.log('Subscribed to @msg/status');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

// เมื่อได้รับข้อความจาก MQTT broker
client.on('message', (topic, message) => {
  console.log(`Message received: ${topic} ${message.toJSON()}`);
  
  // ตัวอย่างเช่น ควบคุมจำนวนหรือการเก็บข้อมูลตามรูปแบบที่ต้องการ
});

// ใช้ bodyParser เพื่ออ่านข้อมูล JSON จาก request
app.use(bodyParser.json());

let publishInProgress = false;
let currentMessage = null;

// Route สำหรับรับคำขอจาก frontend และส่งข้อมูลไปยัง MQTT
app.post('/publish', (req, res) => {
    if (publishInProgress) {
      return res.status(400).json({ error: 'Publish is already in progress' });
    }
  
    const message = req.body;
    const topic = '@msg/status';
  
    if (message && message.moduleId && message.data) {
      publishInProgress = true;
      currentMessage = message; // เก็บข้อมูลของ message ที่กำลังจะ publish
  
      const publishInterval = setInterval(() => {
        if (publishInProgress) {
          client.publish(topic, JSON.stringify(message), (err) => {
            if (err) {
              console.error('Publish failed:', err);
            } else {
              console.log('Message published:', message);
            }
          });
        } else {
          clearInterval(publishInterval); // หยุดการ publish เมื่อถูกยกเลิก
        }
      }, 1000); // ส่งข้อมูลทุก 1 วินาที
  
      return res.status(200).json({ message: 'Message publishing started' });
    } else {
      return res.status(400).json({ error: 'Invalid message format' });
    }
  });
  
  // สร้าง endpoint สำหรับยกเลิกการ publish
  app.post('/cancel-publish', (req, res) => {
    if (!publishInProgress) {
      return res.status(400).json({ error: 'No publish in progress to cancel' });
    }
  
    // เปลี่ยนสถานะเป็นไม่กำลัง publish
    publishInProgress = false;
  
    // ส่งข้อมูลที่ต้องการยกเลิกหรือหยุดการ publish
    console.log('Publish operation cancelled');
  
    return res.status(200).json({ message: 'Publish operation cancelled' });
  });

// เริ่มต้น server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});