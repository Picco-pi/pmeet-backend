const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());

const appID = 1631756339;
const serverSecret = "092212be6fc1fb2ccdd95f585108b25d";

function generateToken(appId, userId, serverSecret, roomId) {
  const expiration = Math.floor(Date.now() / 1000) + 3600;

  const payload = {
    app_id: appId,
    user_id: userId,
    room_id: roomId,
    privilege: {
      login_room: 1,
      publish_stream: 1,
    },
    create_time: Math.floor(Date.now() / 1000),
    expire_time: expiration,
    nonce: Math.floor(Math.random() * 1000000),
  };

  const payloadStr = JSON.stringify(payload);
  const hash = crypto
    .createHmac("sha256", serverSecret)
    .update(payloadStr)
    .digest("hex");

  const token = Buffer.from(
    JSON.stringify({
      payload: payload,
      signature: hash,
    })
  ).toString("base64");

  return token;
}

  app.get("/api/get-token", (req, res) => {

  const { roomID, userID, userName } = req.query;

  if (!roomID || !userID || !userName) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const token = generateToken(appID, userID, serverSecret, roomID);
  res.json({ token });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("🎉 ZEGOCLOUD Backend is Running");
});
