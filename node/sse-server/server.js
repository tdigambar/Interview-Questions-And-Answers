const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Simple SSE endpoint that sends a JSON payload every second
app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  const sendEvent = () => {
    const payload = { time: new Date().toISOString(), value: Math.random() };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // Send one immediately, then every second
  sendEvent();
  const iv = setInterval(sendEvent, 1000);

  req.on('close', () => {
    clearInterval(iv);
  });
});

app.get('/', (req, res) => res.send('SSE example server. Use /events'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SSE server listening on http://localhost:${PORT}`));
