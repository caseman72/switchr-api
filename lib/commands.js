import { request } from "./request.js";

export async function sendCommand(token, secret, deviceId, command, parameter = "default", commandType = "command") {
  return request(token, secret, `/v1.1/devices/${deviceId}/commands`, "POST", {
    command,
    parameter,
    commandType
  });
}
