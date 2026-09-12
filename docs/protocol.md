# PROTOCOL SPECIFICATION — The Screen Weasels

The communication protocol defines message exchange between the macOS Host daemon and the Screen Weasel shells over persistent WebSocket connections.

Default Port: `8765` (configurable)  
Path: `/weasel`  
Format: Typed JSON Envelope (discriminated union on `type`)

---

## 1. Typed Message Envelopes

Every message follows a strict schema validated via Zod (`WeaselMessageSchema`). Malformed payloads are rejected by the receiver.

### Envelope Structure
```typescript
interface WeaselMessage<T> {
  type: 'HAND_UPDATE' | 'FACE_SYNC' | 'AUDIO_FRAME' | 'SHELL_HELLO' | 'TOUCH_EVENT' | 'PING' | 'PONG';
  seq: number;
  timestamp: number;
  payload: T;
}
```

---

## 2. Host to Shell Messages

### `HAND_UPDATE`
Dispatched at 30–60 Hz when the Hand is active or hovering near the boundary.
```json
{
  "type": "HAND_UPDATE",
  "seq": 1042,
  "timestamp": 1726174800123,
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

### `FACE_SYNC`
Authoritative sync carrying the complete face instances (`SyncedFace[]`), pairing immutable visual identity with dynamic expression state.
```json
{
  "type": "FACE_SYNC",
  "seq": 1043,
  "timestamp": 1726174800150,
  "payload": {
    "faces": [
      {
        "identity": {
          "id": "fixture_weasel_01",
          "name": "Green-Orange-Anchor",
          "primaryColor": "#10B981",
          "accentColor": "#F97316",
          "eyeShape": "almond",
          "toothType": "sharp",
          "traitSeed": 101
        },
        "state": {
          "id": "fixture_weasel_01",
          "x": 160,
          "y": 120,
          "vx": 0,
          "vy": 0,
          "scale": 1.0,
          "gazeX": 0.2,
          "gazeY": -0.1,
          "mouthOpen": 0.0,
          "browAngle": 0,
          "expression": "idle",
          "grabbed": false
        }
      }
    ]
  }
}
```

### `AUDIO_FRAME`
Dispatched at 20–30 Hz when Mac system audio feature streaming is active.
```json
{
  "type": "AUDIO_FRAME",
  "seq": 1044,
  "timestamp": 1726174800200,
  "payload": {
    "rms": 0.42,
    "bass": 0.65,
    "mid": 0.38,
    "treble": 0.22,
    "beat": true,
    "timestamp": 1726174800200
  }
}
```

---

## 3. Shell to Host Messages

### `SHELL_HELLO`
Sent immediately by the CYD upon establishing the WebSocket connection.
```json
{
  "type": "SHELL_HELLO",
  "seq": 1,
  "timestamp": 1726174799000,
  "payload": {
    "shellId": "shell_a",
    "firmwareVersion": "0.1.0",
    "freeHeap": 174200,
    "macAddress": "24:6F:28:11:22:33"
  }
}
```

### `TOUCH_EVENT`
Dispatched when physical resistive touch is triggered on the screen.
```json
{
  "type": "TOUCH_EVENT",
  "seq": 2,
  "timestamp": 1726174800500,
  "payload": {
    "active": true,
    "x": 145,
    "y": 80,
    "pressure": 512
  }
}
```
