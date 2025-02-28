"use server"
import mqtt, { IClientOptions } from "mqtt"

const PORT = "1833";
const PROTOCOL = "mqtt"
const HOST = "broker.netpie.io";
const HOST_URL = `${PROTOCOL}://${HOST}:${PORT}`;

const CLIENT_ID = "54f17c3d-83ed-4146-96de-9698b0d7348d";
const TOKEN = "KhQ8SxZKQLHnaY2ySqETcJjmfBySwvWB";
const SECRET = "qynqsDSf6a4NEcwvZbM3mjpgfuBwzxYR";

const options: IClientOptions = {
    keepalive: 60,
    clientId: CLIENT_ID,
    username: TOKEN,
    password: SECRET,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000
}

async function connectMQTT() {
    const mqttClient = mqtt.connect(HOST_URL, options);

    mqttClient.on("connect", ()=> {
        console.log("connected to MQTT broker");
    })

    mqttClient.on("message", (topic, message)=> {
        console.log(`${topic}: ${message.toString()}`);
    })
}