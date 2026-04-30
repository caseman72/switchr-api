import { sendCommand } from "./commands.js";

// Bot in pressMode: a single "press" extends the finger then retracts.
// Bot in switchMode: "turnOn"/"turnOff" leave the finger extended/retracted.

export async function pressBot(token, secret, deviceId) {
  return sendCommand(token, secret, deviceId, "press");
}

export async function turnOnBot(token, secret, deviceId) {
  return sendCommand(token, secret, deviceId, "turnOn");
}

export async function turnOffBot(token, secret, deviceId) {
  return sendCommand(token, secret, deviceId, "turnOff");
}
