// node test-transfer.js
// raju ke 12 transfers, phir priya ka 1 transfer
async function send(user, port) {
  const r = await fetch(`http://localhost:${port}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": user },
    body: JSON.stringify({ to: "someone", amount: 1 }),
  });
  const body = await r.json();
  console.log(`${user} port ${port} -> ${r.status}`, body.retryAfterSeconds ?? "");
}

(async () => {
  for (let i = 1; i <= 12; i++) {
    await send("raju", i % 2 ? 3000 : 3001);
  }
  console.log("--- ab dusra user ---");
  await send("priya", 3000);
})();