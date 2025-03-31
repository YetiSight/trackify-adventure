
/**
 * Arduino Integration Helpers
 * 
 * This file contains examples and utilities to help format data from Arduino
 * to match the expected structure in the web application.
 */

import { SensorData, GeoPoint } from "@/types";

/**
 * Example of how to format sensor data on the Arduino side
 * This can be used as a reference when writing the Arduino code
 * 
 * The JSON structure needs to match the SensorData type
 */
export const arduinoDataExample = {
  ultrasonic: {
    distance: 850,  // in cm
    velocity: 0     // in cm/s
  },
  pir: {
    detected: false
  },
  imu: {
    acceleration: {
      x: 0.2,
      y: -0.1,
      z: 9.8
    },
    gyro: {
      x: 0.01,
      y: 0.03,
      z: -0.02
    },
    orientation: {
      roll: 2.3,   // in degrees
      pitch: -5.7, // in degrees
      yaw: 178.2   // in degrees
    },
    altitude: 2134 // in meters
  },
  gps: {
    position: {
      lat: 46.4086,
      lng: 11.8735,
      altitude: 2134
    },
    speed: 12.4,    // in km/h
    heading: 178,   // in degrees
    accuracy: 3.5   // in meters
  }
};

/**
 * Arduino code example (ESP8266/ESP32)
 * 
 * This is a simplified pseudocode example of how the Arduino
 * with WiFi capabilities would send data to the web app
 */
export const arduinoCodeExample = `
// Arduino ESP8266/ESP32 Example
#include <ESP8266WiFi.h>  // Use <WiFi.h> for ESP32
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// WiFi settings
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// WebSocket server
WebSocketsServer webSocket = WebSocketsServer(80);

// Sensor pins
#define ULTRASONIC_TRIG_PIN 5
#define ULTRASONIC_ECHO_PIN 6
#define PIR_PIN 7

// Function declarations
float measureDistance();
boolean detectMotion();
void getIMUData(float& roll, float& pitch, float& yaw, float& altitude);
void getGPSData(float& lat, float& lng, float& speed, float& heading);

void setup() {
  Serial.begin(115200);
  
  // Initialize sensors
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  pinMode(PIR_PIN, INPUT);
  
  // Initialize WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  // Every 500ms, send sensor data
  static unsigned long lastTime = 0;
  if(millis() - lastTime > 500) {
    sendSensorData();
    lastTime = millis();
  }
}

void sendSensorData() {
  // Create JSON document
  DynamicJsonDocument doc(1024);
  
  // Ultrasonic sensor data
  float distance = measureDistance();
  static float lastDistance = distance;
  static unsigned long lastDistanceTime = millis();
  float velocity = (lastDistance - distance) / ((millis() - lastDistanceTime) / 1000.0);
  lastDistance = distance;
  lastDistanceTime = millis();
  
  doc["ultrasonic"]["distance"] = distance * 100; // convert to cm
  doc["ultrasonic"]["velocity"] = velocity * 100; // convert to cm/s
  
  // PIR sensor data
  doc["pir"]["detected"] = detectMotion();
  
  // IMU data (accelerometer, gyroscope, orientation, altitude)
  float roll, pitch, yaw, altitude;
  getIMUData(roll, pitch, yaw, altitude);
  
  doc["imu"]["acceleration"]["x"] = 0.2; // replace with actual readings
  doc["imu"]["acceleration"]["y"] = -0.1;
  doc["imu"]["acceleration"]["z"] = 9.8;
  
  doc["imu"]["gyro"]["x"] = 0.01; // replace with actual readings
  doc["imu"]["gyro"]["y"] = 0.03;
  doc["imu"]["gyro"]["z"] = -0.02;
  
  doc["imu"]["orientation"]["roll"] = roll;
  doc["imu"]["orientation"]["pitch"] = pitch;
  doc["imu"]["orientation"]["yaw"] = yaw;
  
  doc["imu"]["altitude"] = altitude;
  
  // GPS data
  float lat, lng, speed, heading;
  getGPSData(lat, lng, speed, heading);
  
  doc["gps"]["position"]["lat"] = lat;
  doc["gps"]["position"]["lng"] = lng;
  doc["gps"]["position"]["altitude"] = altitude;
  doc["gps"]["speed"] = speed;
  doc["gps"]["heading"] = heading;
  doc["gps"]["accuracy"] = 3.5; // example value
  
  // Convert to String
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send to all connected clients
  webSocket.broadcastTXT(jsonString);
}

// WebSocket event handler
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      }
      break;
    case WStype_TEXT:
      // Handle incoming messages if needed
      break;
  }
}

// Sensor reading functions (implement based on your specific sensors)
float measureDistance() {
  // Ultrasonic sensor implementation
  return 8.5; // example: 8.5 meters
}

boolean detectMotion() {
  // PIR sensor implementation
  return digitalRead(PIR_PIN) == HIGH;
}

void getIMUData(float& roll, float& pitch, float& yaw, float& altitude) {
  // Read from IMU sensor
  roll = 2.3;
  pitch = -5.7;
  yaw = 178.2;
  altitude = 2134;
}

void getGPSData(float& lat, float& lng, float& speed, float& heading) {
  // Read from GPS module
  lat = 46.4086;
  lng = 11.8735;
  speed = 12.4;
  heading = 178;
}
`;

/**
 * Parse raw Arduino data into the expected SensorData format
 * This can be useful if the Arduino is sending data in a different format
 * than what the app expects
 */
export function parseArduinoData(rawData: string): SensorData {
  try {
    // First try to parse as JSON
    const parsed = JSON.parse(rawData);
    
    // Check if the data matches our expected structure
    if (parsed.ultrasonic && parsed.pir && parsed.imu && parsed.gps) {
      return parsed as SensorData;
    }
    
    // If not complete, build a partial object with what we have
    return {
      ultrasonic: parsed.ultrasonic || { distance: 0, velocity: 0 },
      pir: parsed.pir || { detected: false },
      imu: parsed.imu || {
        acceleration: { x: 0, y: 0, z: 0 },
        gyro: { x: 0, y: 0, z: 0 },
        orientation: { roll: 0, pitch: 0, yaw: 0 },
        altitude: 0
      },
      gps: parsed.gps || {
        position: { lat: 0, lng: 0, altitude: 0 },
        speed: 0,
        heading: 0,
        accuracy: 0
      }
    };
  } catch (e) {
    console.error("Failed to parse Arduino data:", e);
    // Return default data structure if parsing fails
    return {
      ultrasonic: { distance: 0, velocity: 0 },
      pir: { detected: false },
      imu: {
        acceleration: { x: 0, y: 0, z: 0 },
        gyro: { x: 0, y: 0, z: 0 },
        orientation: { roll: 0, pitch: 0, yaw: 0 },
        altitude: 0
      },
      gps: {
        position: { lat: 0, lng: 0, altitude: 0 },
        speed: 0,
        heading: 0,
        accuracy: 0
      }
    };
  }
}
