# switchr-api

SwitchBot API client for Node.js. Read temperature sensors and control devices.

## Setup

1. Get API credentials from the SwitchBot app: Profile > Preferences > Developer Options
2. Create `.env.local` with your credentials (checked in order, first found is used):
   - `.env.local` (current directory)
   - `~/.config/switchr-api/.env.local`
   - `~/.switchbot.env.local`

```
SWITCHBOT_TOKEN=your-token-here
SWITCHBOT_SECRET=your-secret-here
```

## Usage

```javascript
import Switchr from "switchr-api";

const switchr = new Switchr();

// List devices
const { devices } = await switchr.getDevices();

// Temperature sensors (Meter, MeterPlus, WoIOSensor)
const temp = await switchr.getTemperature(deviceId);
console.log(temp.temperature, temp.unit, temp.humidity, temp.battery);
const all = await switchr.getAllTemperatures();

// Plug Mini — power state and energy data
const plug = await switchr.getPlugStatus(deviceId);
console.log(plug.power, plug.voltage, plug.watts, plug.currentMilliamps);
const allPlugs = await switchr.getAllPlugs();
await switchr.turnOn(deviceId);
await switchr.turnOff(deviceId);

// Bot (finger simulator) — momentary press for pressMode bots
await switchr.pressBot(deviceId);
// switchMode bots:
await switchr.turnOnBot(deviceId);
await switchr.turnOffBot(deviceId);

// Generic device status
const status = await switchr.getStatus(deviceId);
```

## License

MIT
