import { request } from "./request.js";

export async function getDeviceList(token, secret) {
  const data = await request(token, secret, "/v1.1/devices");
  return {
    devices: data.deviceList || [],
    infrared: data.infraredRemoteList || []
  };
}

export async function getDeviceStatus(token, secret, deviceId) {
  return request(token, secret, `/v1.1/devices/${deviceId}/status`);
}
