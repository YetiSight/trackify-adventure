
/**
 * Arduino Sensors to ThingSpeak Example
 * 
 * This example shows how to send sensor data from an ESP8266/ESP32 to ThingSpeak
 * 
 * Hardware:
 * - ESP8266 or ESP32 with WiFi capabilities
 * - Ultrasonic sensor (HC-SR04)
 * - IMU (MPU6050 or similar)
 * - GPS module (optional)
 * 
 * Libraries needed:
 * - ESP8266WiFi.h or WiFi.h for ESP32
 * - ThingSpeak.h (https://github.com/mathworks/thingspeak-arduino)
 * - Wire.h for I2C communication
 * - MPU6050.h for the IMU sensor
 * - TinyGPS++ for GPS module
 */

// For ESP8266
#include <ESP8266WiFi.h>

// For ESP32
// #include <WiFi.h>

#include <ThingSpeak.h>
#include <Wire.h>
#include <MPU6050.h>
#include <TinyGPS++.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ThingSpeak information
unsigned long channelID = 2271252;  // Replace with your ThingSpeak Channel ID
const char* writeAPIKey = "YOUR_WRITE_API_KEY"; // Replace with your ThingSpeak Write API Key

// Ultrasonic sensor pins
const int trigPin = D1;  // Use appropriate pin for your board
const int echoPin = D2;  // Use appropriate pin for your board

// Create an instance of the MPU6050 sensor
MPU6050 mpu;

// Create a TinyGPS++ object for GPS
TinyGPSPlus gps;

// Initialize ThingSpeak client
WiFiClient client;

// Variables for sensor data
float distance = 0;      // Ultrasonic distance in cm
float roll = 0;          // Roll angle in degrees
float pitch = 0;         // Pitch angle in degrees
float yaw = 0;           // Yaw angle (heading) in degrees
float altitude = 1800;   // Altitude in meters (default if no GPS)
float latitude = 46.4086;// Default latitude (update with GPS)
float longitude = 11.8735; // Default longitude (update with GPS)
float speed = 0;         // Speed in km/h
float heading = 0;       // Heading in degrees

void setup() {
  Serial.begin(115200);
  
  // Initialize ultrasonic sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Initialize I2C communication
  Wire.begin();
  
  // Initialize MPU6050
  Serial.println("Initializing MPU6050...");
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)) {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }
  
  // Setup MPU6050 sensor
  mpu.calibrateGyro();
  mpu.setThreshold(3);
  
  // Connect to WiFi
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
  
  // Initialize ThingSpeak
  ThingSpeak.begin(client);
}

void loop() {
  // Read ultrasonic distance
  distance = readUltrasonicDistance();
  
  // Read IMU data
  Vector normAccel = mpu.readNormalizeAccel();
  Vector normGyro = mpu.readNormalizeGyro();
  
  // Calculate orientation using simple complementary filter
  // In a real application, use more sophisticated algorithms
  roll = 0.96 * (roll + normGyro.YAxis * 0.01) + 0.04 * atan2(normAccel.XAxis, normAccel.ZAxis) * 180/M_PI;
  pitch = 0.96 * (pitch + normGyro.XAxis * 0.01) + 0.04 * atan2(normAccel.YAxis, normAccel.ZAxis) * 180/M_PI;
  
  // Read heading (yaw) - this is simulated
  // In a real application, use a magnetometer for accurate heading
  heading = (heading + normGyro.ZAxis * 0.01);
  if (heading < 0) heading += 360;
  if (heading >= 360) heading -= 360;
  
  // Read GPS data (if available)
  // This would be replaced with actual GPS reading
  while (Serial.available() > 0) {
    if (gps.encode(Serial.read())) {
      if (gps.location.isUpdated()) {
        latitude = gps.location.lat();
        longitude = gps.location.lng();
      }
      
      if (gps.speed.isUpdated()) {
        speed = gps.speed.kmph();
      }
      
      if (gps.altitude.isUpdated()) {
        altitude = gps.altitude.meters();
      }
      
      if (gps.course.isUpdated()) {
        heading = gps.course.deg();
      }
    }
  }
  
  // Print values to serial monitor for debugging
  Serial.println("Sensor readings:");
  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");
  Serial.print("Roll: "); Serial.print(roll); Serial.println(" degrees");
  Serial.print("Pitch: "); Serial.print(pitch); Serial.println(" degrees");
  Serial.print("Heading: "); Serial.print(heading); Serial.println(" degrees");
  Serial.print("Altitude: "); Serial.print(altitude); Serial.println(" m");
  Serial.print("GPS: "); Serial.print(latitude, 6); Serial.print(", "); Serial.println(longitude, 6);
  Serial.print("Speed: "); Serial.print(speed); Serial.println(" km/h");
  
  // Set the fields with our values
  ThingSpeak.setField(1, distance);
  ThingSpeak.setField(2, pitch);
  ThingSpeak.setField(3, roll);
  ThingSpeak.setField(4, altitude);
  ThingSpeak.setField(5, latitude);
  ThingSpeak.setField(6, longitude);
  ThingSpeak.setField(7, speed);
  ThingSpeak.setField(8, heading);
  
  // Write to ThingSpeak
  int response = ThingSpeak.writeFields(channelID, writeAPIKey);
  
  if (response == 200) {
    Serial.println("Channel update successful");
  } else {
    Serial.println("Error updating channel. HTTP error code: " + String(response));
  }
  
  // ThingSpeak free account has a limitation of 15 seconds between updates
  delay(15000);
}

// Function to read distance from ultrasonic sensor
float readUltrasonicDistance() {
  // Clear the trigger pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  // Send a 10μs pulse to trigger
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read the echo pin, convert to cm
  // Sound travels at ~343m/s, so 29μs per cm round trip
  long duration = pulseIn(echoPin, HIGH);
  return duration / 29.0 / 2.0;
}
