let messages = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, message, userAgent } = req.body;
    const time = new Date().toLocaleString("ko-KR");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    messages.push({ name, message, time, ip, userAgent });

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    return res.status(200).json(messages);
  }

  res.status(405).end();
}
