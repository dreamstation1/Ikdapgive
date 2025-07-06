import { writeFile, readFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data.json");

  if (req.method === "POST") {
    const { name, message, userAgent } = req.body;
    const time = new Date().toLocaleString("ko-KR");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    let existing = [];
    try {
      const data = await readFile(filePath, "utf-8");
      existing = JSON.parse(data);
    } catch {
      // 파일 없으면 빈 배열
    }

    existing.push({ name, message, time, ip, userAgent });
    await writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    try {
      const data = await readFile(filePath, "utf-8");
      return res.status(200).json(JSON.parse(data));
    } catch {
      return res.status(200).json([]);
    }
  }

  res.status(405).end();
}
