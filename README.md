# switchr-api

SwitchBot API client for Node.js. Read temperature sensors and control devices.

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Get API credentials from the SwitchBot app: Profile > Preferences > Developer Options

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

// Get single temperature
const temp = await switchr.getTemperature(deviceId);
console.log(temp.temperature, temp.unit, temp.humidity, temp.battery);

// Get all temperatures
const all = await switchr.getAllTemperatures();

// Get device status
const status = await switchr.getStatus(deviceId);
```

## License

ISC
