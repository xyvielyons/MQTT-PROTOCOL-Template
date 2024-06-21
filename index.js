import mqtt from "mqtt";
import fs from 'fs'
//we connect to the hivemq public mqtt broker
//An MQTT broker is a server that acts as an intermediary between MQTT clients.
const protocol = 'ws'
const host = 'broker.emqx.io'
const port = '8083'
const path = '/mqtt'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}${path}`

const client = mqtt.connect(connectUrl,{
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
  ca: fs.readFileSync('./broker.emqx.io-ca.crt'),
});
const topic1 = '/nodejs/mqtt1';
const topic2 = '/nodejs/mqtt2';

client.on("connect", () => {
    client.subscribe([topic1, topic2], (err) => {
        if (!err) {
            console.log(`Subscribed to topics: ${topic1}, ${topic2}`);
            client.publish("presence", "Hello mqtt");
        } else {
            console.error('Error subscribing to topics:', err);
        }
    });
});

client.on("message", (topic, message) => {
    console.log(`Message received on topic: ${topic}`);
    console.log(`Message content: ${message.toString()}`);

    // Optional: Handle message based on topic
    if (topic === topic1) {
        // Handle message from topic 1
    } else if (topic === topic2) {
        // Handle message from topic 2
    }
});

client.publish(topic1, 'nodejs mqtt test1');
client.publish(topic2, 'nodejs mqtt test2');