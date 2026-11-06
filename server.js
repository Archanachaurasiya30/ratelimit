require("dotenv").config();
const express = require("express");
const { rateLimit } = require("./rateLimit"); 

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Login: 5 per minute per IP (the user isn't identified yet, so we count by IP).
const loginByIp = rateLimit({
  name: "login-ip", limit: 5, windowSec: 60,
  keyFn: (req) => req.ip,
});

// Transfer: 10 per minute per logged-in user.
// Replace the x-user-id header with req.userId from your auth middleware.
const transferByUser = rateLimit({
  name: "transfer", limit: 10, windowSec: 60,
  keyFn: (req) => req.headers["x-user-id"] || req.ip,
});

// Read-only routes: relaxed limit.
const viewLimit = rateLimit({
  name: "view", limit: 100, windowSec: 60,
  keyFn: (req) => req.headers["x-user-id"] || req.ip,
});

app.post("/login", loginByIp, (req, res) =>
  res.json({ ok: true, servedBy: PORT }));

app.post("/transfer", transferByUser, (req, res) =>
  res.json({ ok: true, servedBy: PORT }));

app.get("/balance", viewLimit, (req, res) =>
  res.json({ balance: 1000, servedBy: PORT }));

app.listen(PORT, () => console.log(`Server on ${PORT}`));