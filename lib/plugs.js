import { getDeviceStatus } from "./devices.js";
import { sendCommand } from "./commands.js";

// SwitchBot Plug Mini status fields:
//   power: "on" | "off"
//   voltage: V
//   weight: W (instantaneous power draw — SwitchBot's field name)
//   electricCurrent: mA
//   electricityOfDay: minutes the plug was on today

export async function getPlugStatus(token, secret, deviceId) {
  const status = await getDeviceStatus(token, secret, deviceId);
  return {
    power: status.power,
    voltage: status.voltage,
    watts: status.weight,
    currentMilliamps: status.electricCurrent,
    electricityOfDay: status.electricityOfDay,
    raw: status
  };
}

export async function turnOnPlug(token, secret, deviceId) {
  return sendCommand(token, secret, deviceId, "turnOn");
}

export async function turnOffPlug(token, secret, deviceId) {
  return sendCommand(token, secret, deviceId, "turnOff");
}

export function isPlugType(deviceType) {
  return /^Plug Mini/.test(deviceType) || deviceType === "Plug";
}
