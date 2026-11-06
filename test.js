// node test.js -> 20 login attempts, port 3000 aur 3001 par alternate
(async () => {
  for (let i = 1; i <= 20; i++) {
    const port = i % 2 ? 3000 : 3001;
    const r = await fetch(`http://localhost:${port}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "raju@gmail.com", password: "wrong" + i }),
    });
    const body = await r.json();
    console.log(`#${i} port ${port} -> ${r.status}`, body.retryAfterSeconds ?? "");
  }
})();