"use client"

import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "broker.netpie.io";
const CLIENT_ID = "fb21da34-f7b0-4719-8c62-7372a12c35b7";
const TOKEN = "yYfeyi9TUkx71C6wwzM1P37i5cg31WPN";
const SECRET = "kPE1jvLfBwcoTES9HTo2ZsMW5SneEQ97";
const url = `mqtt://${CLIENT_ID}:${TOKEN}@${MQTT_BROKER}`

const TOPIC = "@msg/+";

export default function MQTTComponent() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const client = mqtt.connect(url, {
      clientId: CLIENT_ID,
      clean: true,
      connectTimeout: 30 * 1000,
      reconnectPeriod: 1000
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker via WebSockets");

      const topic = "@msg/+"; // Replace with your topic
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });

    client.on("error", (err) => console.error("MQTT Error:", err));
    client.on("close", () => console.log("MQTT Connection closed"));

    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>MQTT Status Messages</h1>
      <p>Last message: {message || "Waiting for messages..."}</p>
    </div>
  );
}
