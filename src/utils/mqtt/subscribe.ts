"use server"

export const subscribeToMqtt = async (areaName: string, deviceName: string) => {
    try {
        await fetch('http://localhost:5175/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ areaName, deviceName })
        });
    } catch (error) {
        console.error('Error subscribing to MQTT:', error);
    }
};