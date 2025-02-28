"use server"

export const subscribeToMqtt = async (areaId: number, deviceId: number) => {
    try {
        await fetch('http://localhost:5175/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ areaId, deviceId })
        });
    } catch (error) {
        console.error('Error subscribing to MQTT:', error);
    }
};