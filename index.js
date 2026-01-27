import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { config } from "dotenv";
import { getDeviceList, getDeviceStatus } from "./lib/devices.js";
import { getTemperature } from "./lib/sensors.js";
import { getRateLimitStatus, RateLimitError } from "./lib/request.js";
import { loadDeviceCache, saveDeviceCache, clearDeviceCache, getCacheAge } from "./lib/deviceCache.js";

// Load .env.local from first available location
const envPaths = [
  ".env.local",
  join(homedir(), ".config", "switchr-api", ".env.local"),
  join(homedir(), ".switchbot.env.local")
];

const envPath = envPaths.find(p => existsSync(p));
if (envPath) {
  config({ path: envPath });
}

class Switchr {
  constructor(options = {}) {
    this.cachePath = options.cachePath || ".";
    this.token = options.token || process.env.SWITCHBOT_TOKEN;
    this.secret = options.secret || process.env.SWITCHBOT_SECRET;
  }

  // Devices (cached)
  async getDevices(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = loadDeviceCache(this.cachePath);
      if (cached) {
        console.log("Using cached device list");
        return cached;
      }
    }

    console.log("Fetching device list from API...");
    const result = await getDeviceList(this.token, this.secret);
    saveDeviceCache(result, this.cachePath);
    return result;
  }

  async refreshDevices() {
    return this.getDevices(true);
  }

  clearDeviceCache() {
    clearDeviceCache(this.cachePath);
  }

  getDeviceCacheAge() {
    const age = getCacheAge(this.cachePath);
    if (age === null) return null;
    return {
      ms: age,
      seconds: Math.floor(age / 1000),
      minutes: Math.floor(age / 60000),
      hours: Math.floor(age / 3600000)
    };
  }

  async getDevice(name) {
    const { devices } = await this.getDevices();
    return devices.find(d => d.deviceName.toLowerCase() === name.toLowerCase());
  }

  async getDeviceById(deviceId) {
    const { devices } = await this.getDevices();
    return devices.find(d => d.deviceId === deviceId);
  }

  async getDevicesByType(type) {
    const { devices } = await this.getDevices();
    return devices.filter(d => d.deviceType.toLowerCase() === type.toLowerCase());
  }

  // Get device status
  async getStatus(deviceId) {
    return getDeviceStatus(this.token, this.secret, deviceId);
  }

  // Temperature sensors
  async getTemperature(deviceId, unit = "F") {
    return getTemperature(this.token, this.secret, deviceId, unit);
  }

  async getAllTemperatures(unit = "F") {
    const { devices } = await this.getDevices();
    const sensors = devices.filter(d =>
      d.deviceType === "Meter" ||
      d.deviceType === "MeterPlus" ||
      d.deviceType === "WoIOSensor"
    );

    const results = [];
    for (const sensor of sensors) {
      try {
        const temp = await this.getTemperature(sensor.deviceId, unit);
        results.push({
          name: sensor.deviceName,
          deviceId: sensor.deviceId,
          ...temp
        });
      }
      catch (err) {
        results.push({
          name: sensor.deviceName,
          deviceId: sensor.deviceId,
          error: err.message
        });
      }
    }
    return results;
  }

  // Rate limit status
  getRateLimitStatus() {
    return getRateLimitStatus();
  }
}

export default Switchr;
export { Switchr, RateLimitError };
