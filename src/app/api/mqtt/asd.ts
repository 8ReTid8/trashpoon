import mqtt from 'mqtt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // MQTT broker URL
    const brokerUrl = 'mqtt://broker.netpie.io:1833'; // Example using WebSocket connection
    const client = mqtt.connect(brokerUrl, {
        clientId: 'fb21da34-f7b0-4719-8c62-7372a12c35b7', // Set Client ID
        username: 'yYfeyi9TUkx71C6wwzM1P37i5cg31WPN', // Username
        password: 'kPE1jvLfBwcoTES9HTo2ZsMW5SneEQ97' // Password
    });

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        return NextResponse.json({ Message: "connected", status: 200 })

        // Subscribe to a topic
        client.subscribe('test/topic', (err) => {
            if (err) {
                console.log('Error subscribing to topic:', err);
                // res.json({ message: 'Failed to subscribe to topic' });
                return;
            }

            console.log('Subscribed to test/topic');
        });
    });

    // Handle incoming messages
    client.on('message', (topic: string, message: Buffer) => {
        console.log(`Received message on ${topic}: ${message.toString()}`);
        // Send the message back to the client
        // res.status(200).json({ message: message.toString() });

        // Clean up the MQTT client after the response
        client.end();
    });

    // Handle error events
    client.on('error', (err: Error) => {
        console.error('Error with MQTT connection:', err);
        return NextResponse.json({ Message: "error", status: 500 })
    });
    return NextResponse.json({ Message: "work", status: 500 })
};
