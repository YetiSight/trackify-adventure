
import { SensorData } from "@/types";

// Base coordinates for ski resorts in Italy (Dolomites area)
const baseCoordinates = [
  { lat: 46.4086, lng: 11.8735 }, // Cortina d'Ampezzo
  { lat: 46.5404, lng: 11.8564 }, // Val Gardena
  { lat: 46.5295, lng: 12.1366 }, // Tre Cime di Lavaredo
  { lat: 46.2730, lng: 11.4383 }  // Val di Fassa
];

// Function to generate random number between min and max
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Function to generate a random coordinate near a base point
function randomCoordinateNear(base: {lat: number, lng: number}, maxDistanceDeg: number): {lat: number, lng: number} {
  return {
    lat: base.lat + randomBetween(-maxDistanceDeg, maxDistanceDeg),
    lng: base.lng + randomBetween(-maxDistanceDeg, maxDistanceDeg)
  };
}

// Generate random test data that simulates skiing
export function generateTestSensorData(previousData?: SensorData): SensorData {
  // Select a base location if no previous data
  const baseLocation = previousData?.gps?.position || 
    baseCoordinates[Math.floor(Math.random() * baseCoordinates.length)];
  
  // Generate a new position that's slightly changed from the previous one
  const newPosition = randomCoordinateNear(baseLocation, 0.0005);
  
  // Generate a speed value between 5 and 50 km/h
  const speed = previousData ? 
    Math.max(5, previousData.gps.speed + randomBetween(-3, 3)) : 
    randomBetween(5, 30);
  
  // Cap speed between 5 and 60 km/h
  const cappedSpeed = Math.min(60, Math.max(5, speed));
  
  // Generate altitude between 1500 and 2500m with slight changes if previous data exists
  const baseAltitude = previousData?.imu?.altitude || randomBetween(1500, 2500);
  const altitude = Math.max(1200, baseAltitude + randomBetween(-5, -1)); // Generally going downhill
  
  // Random orientation
  const roll = randomBetween(-10, 10);
  const pitch = randomBetween(-15, 15);
  const yaw = randomBetween(0, 360);
  
  // Random heading (direction of travel)
  const heading = randomBetween(0, 360);
  
  // Occasionally generate collision risk (about 5% chance)
  const hasCollisionRisk = Math.random() < 0.05;
  
  // Random distance to objects ahead
  const distance = hasCollisionRisk ? 
    randomBetween(50, 250) : // Closer objects when collision risk
    randomBetween(300, 1000); // Further objects normally
  
  return {
    ultrasonic: {
      distance: distance,
      velocity: 0
    },
    pir: {
      detected: Math.random() > 0.7 // 30% chance of movement detection
    },
    imu: {
      acceleration: {
        x: randomBetween(-1, 1),
        y: randomBetween(-1, 1),
        z: randomBetween(8, 10) // Roughly earth's gravity
      },
      gyro: {
        x: randomBetween(-0.5, 0.5),
        y: randomBetween(-0.5, 0.5),
        z: randomBetween(-0.5, 0.5)
      },
      orientation: {
        roll: roll,
        pitch: pitch,
        yaw: yaw
      },
      altitude: altitude
    },
    gps: {
      position: newPosition,
      speed: cappedSpeed,
      heading: heading,
      accuracy: randomBetween(1, 5)
    },
    collisionRisk: hasCollisionRisk
  };
}
