"use server"

export const publishToMqtt = async (areaName: string, deviceName: string, action: string) => {
    try {
        await fetch('http://localhost:5175/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ areaName, deviceName, action })
        });
    } catch (error) {
        console.error('Error publish to MQTT:', error);
    }
};