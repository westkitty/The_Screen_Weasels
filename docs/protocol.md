# PROTOCOL SPECIFICATION — The Screen Weasels

The communication protocol defines message exchange between the macOS Host daemon and the Screen Weasel shells over persistent WebSocket connections.

Default Port: `8765`  
Path: `/weasel`  
Format: Compact JSON (v1) / Binary Packed (v2 optimization if needed)

---

## 1. Message Types & Framing

Every message has an envelope:
```json
{
  "type": "STRING_TYPE",
  "seq": 1042,
  "timestamp": 1726174800123,
  "payload": {}
}
```

### Host to Shell Messages

#### `HAND_UPDATE`
Broadcast at 30–60 Hz when the Hand is active or hovering near the boundary:
```json
{
  "type": "HAND_UPDATE",
  "payload": {
    "active": true,
    "shellId": "shell_a",
    "x": 160.5,
    "y": 120.0,
    "vx": -15.2,
    "vy": 4.1,
    "clicked": false,
    "edgeGlow": 0.85
  }
}
```

#### `FACE_SYNC`
Dispatched when face identities or high-level states change:
```json
{
  "type": "FACE_SYNC",
  "payload": {
    "faces": [
      {
        "id": "weasel_01",
        "name": "Emerald_Snarl",
        "primaryColor": "#10B981",
        "accentColor": "#F97316",
        "x": 160,
        "y": 120,
        "scale": 1.0,
        "gazeX": 0.2,
        "gazeY": -0.1,
        "mouthOpen": 0.0,
        "expression": "idle"
      }
    ]
  }
}
```

#### `AUDIO_FRAME`
Dispatched at 20–30 Hz when Mac system audio is active:
```json
{
  "type": "AUDIO_FRAME",
  "payload": {
    "rms": 0.42,
    "bass": 0.65,
    "mid": 0.38,
    "treble": 0.22,
    "beat": true
  }
}
```

---

## 2. Shell to Host Messages

#### `SHELL_HELLO`
Sent by the CYD upon establishing connection:
```json
{
  "type": "SHELL_HELLO",
  "payload": {
    "shellId": "cyd_a",
    "firmwareVersion": "0.1.0",
    "freeHeap": 174200,
    "macAddress": "24:6F:28:XX:XX:XX"
  }
}
```

#### `TOUCH_EVENT`
Dispatched when physical resistive touch is triggered:
```json
{
  "type": "TOUCH_EVENT",
  "payload": {
    "active": true,
    "x": 145,
    "y": 80,
    "pressure": 512
  }
}
```
