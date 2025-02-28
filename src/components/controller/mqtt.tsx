"use client"

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function MQTTComponent() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the MQTT broker (using MQTT over TCP)
    const client = mqtt.connect('mqtt://broker.netpie.io:1883', {  // MQTT TCP connection on port 1883
      clientId: '54f17c3d-83ed-4146-96de-9698b0d7348d', // Set Client ID
      username: 'KhQ8SxZKQLHnaY2ySqETcJjmfBySwvWB', // Username
      password: 'qynqsDSf6a4NEcwvZbM3mjpgfuBwzxYR', // Password
      protocol: "mqtt"  // Standard MQTT protocol
    });

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('test/topic', (err) => {
        if (err) {
          console.log('Error subscribing to topic', err);
        } else {
          console.log('Subscribed to test/topic');
        }
      });
    });

    client.on('message', (topic, payload) => {
      console.log(`Received message: ${payload.toString()}`);
      setMessage(payload.toString()); // Update state with the received message
    });

    client.on('error', (err) => {
      console.error('Error with MQTT connection:', err);
    });

    // Cleanup the connection when the component is unmounted
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
