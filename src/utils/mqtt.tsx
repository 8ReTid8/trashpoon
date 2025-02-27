"use client"

import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "mqtt://broker.netpie.io/mqtt";
const CLIENT_ID = "fb21da34-f7b0-4719-8c62-7372a12c35b7";
const TOKEN = "yYfeyi9TUkx71C6wwzM1P37i5cg31WPN";
const SECRET = "kPE1jvLfBwcoTES9HTo2ZsMW5SneEQ97";
const TOPIC = "@msg/status";

export default function MQTTComponent() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: CLIENT_ID,
      username: TOKEN,
      password: SECRET,
      protocol: "tcp",
    });

    client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      client.subscribe(TOPIC, (err) => {
        if (!err) {
          console.log(`Subscribed to ${TOPIC}`);
        } else {
          console.error("Subscription error:", err);
        }
      });
    });

    client.on("message", (topic, payload) => {
      console.log(`Received message on ${topic}:`, payload.toString());
      setMessage(payload.toString());
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });

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
