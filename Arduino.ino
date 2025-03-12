#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <VL53L0X.h>
#include <Adafruit_PWMServoDriver.h>

#define SERVOMIN  100
#define SERVOMAX  300
#define SERVO_FREQ 50

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();
VL53L0X sensor;
const int pingPin = 5;
int inPin = 4;

const char* subscribe_topic = "@msg/order";
const char* publish_topic = "@msg/floor1/test";
const char* ssid = "Goon";
const char* password = "1234567890";

const char* mqtt_server = "mqtt.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_client = "415a8219-61af-490e-90b2-d425200b36e3";
const char* mqtt_username = "96epEXMcVSXXnVpSwkyJZ8vrUNqmA72m";
const char* mqtt_password = "7FhYHT2XzaggAwUHgPHMJYhcY3DTMibA";

WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
long duration, cm, range, now;
int value = 0;
String order_msg = "0";
char msg[50];
char msg_fb[100];

void setup() {
  Serial.begin(115200);
  Wire.begin();
  pwm.begin();

  pwm.setOscillatorFrequency(27000000);
  pwm.setPWMFreq(SERVO_FREQ); 
  pwm.setPWM(0, 0, SERVOMIN);

  sensor.setTimeout(500);
  if (!sensor.init())
  {
    Serial.println("Failed to detect and initialize sensor!");
    while (1) {}
  }
  
  sensor.startContinuous();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  now = millis();
  if (now - lastMsg > 10000) {
    lastMsg = now;

    range = sensor.readRangeContinuousMillimeters();
    if (sensor.timeoutOccurred()) { Serial.print(" TIMEOUT"); }
    if (order_msg == "0") {
      Serial.print(range);
      if (range <= 100){
          pwm.setPWM(0, 0, SERVOMAX);
          Serial.println("-LOCK");  
          value = 0;
      } else {
        pwm.setPWM(0, 0, SERVOMIN);
        Serial.println("-UNLOCK"); 
        value = 1;
      }
    } else {
        pwm.setPWM(0, 0, SERVOMIN);
        Serial.println("ORDER-UNLOCK");  
    }

    snprintf (msg, 50, "%ld", value); 
    String payload = "{\"data\": {\"status\": " + String(value) + ",\"capacity\": " + String(range) + "}}";
    payload.toCharArray(msg,50);
    client.publish(publish_topic, msg); 
    
    payload.toCharArray(msg_fb, (payload.length() + 1));
    client.publish("@shadow/data/update", msg_fb);
  }
}
void callback(char* topic,byte* payload, unsigned int length) {
  order_msg = "";
  for (int i = 0; i < length; i++) {
    order_msg = order_msg + (char)payload[i];
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection..");
    if (client.connect(mqtt_client, mqtt_username, mqtt_password)) {
      Serial.println("Connected");
      client.subscribe(subscribe_topic);
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("Try again in 5 seconds...");
      delay(5000);
    }
  }
}