import { getDeviceStatus } from "./devices.js";

export async function getTemperature(token, secret, deviceId, unit = "F") {
  const status = await getDeviceStatus(token, secret, deviceId);

  const tempC = status.temperature;
  const humidity = status.humidity;
  const battery = status.battery;

  let temperature = tempC;
  if (unit === "F") {
    temperature = (tempC * 1.8) + 32;
  }

  return {
    temperature,
    unit,
    humidity,
    battery,
    raw: status
  };
}
