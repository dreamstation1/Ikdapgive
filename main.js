window.onload = () => {
  const savedName = localStorage.getItem("guestName");
  if (savedName) {
    document.getElementById("nameInput").value = savedName;
    showOnly("messageSection");
  } else {
    showOnly("nameSection");
  }
};

document.getElementById("nameBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  if (name) {
    localStorage.setItem("guestName", name);
    showOnly("messageSection");
  } else {
    alert("이름을 입력해주세요!");
  }
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value.trim();
  const name = localStorage.getItem("guestName");
  const userAgent = navigator.userAgent;

  if (message) {
    fetch("https://ikdapgive-z87w.vercel.app/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, message, userAgent })
    })
    .then(() => {
      document.getElementById("messageSection").classList.add("hidden");
      document.getElementById("successSection").classList.remove("hidden");
      document.getElementById("messageInput").value = "";
    });
  } else {
    alert("메시지를 입력해주세요!");
  }
});

// pages/api/messages.js
import { writeFile, readFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, message, userAgent } = req.body;
    const time = new Date().toLocaleString("ko-KR");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    let existing = [];
    try {
      const fileData = await readFile(filePath, "utf-8");
      existing = JSON.parse(fileData);
    } catch {
      // 파일 없으면 빈 배열로 둠
    }

    existing.push({ name, message, time, ip, userAgent });
    await writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    try {
      const fileData = await readFile(filePath, "utf-8");
      const json = JSON.parse(fileData);
      return res.status(200).json(json);
    } catch {
      return res.status(200).json([]);
    }
  }
}


document.getElementById("anotherBtn").addEventListener("click", () => {
  showOnly("messageSection");
});

function showOnly(sectionId) {
  document.querySelectorAll(".wrapper").forEach(div => {
    div.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

document.getElementById("adminBtn").addEventListener("click", () => {
  showOnly("adminSection");
});

document.getElementById("checkPassBtn").addEventListener("click", () => {
  const pass = document.getElementById("adminPass").value;

  if (pass === "5263815731abc!") {
    fetch("https://ikdapgive-z87w.vercel.app/api/messages")
      .then(res => res.json())
      .then(data => {
        showOnly("allMessages");

        const tbody = document.querySelector("#msgTable tbody");
        tbody.innerHTML = "";
        data.forEach(item => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.message}</td>
            <td>${item.time}</td>
            <td>${item.ip}</td>
          `;
          tbody.appendChild(tr);
        });
      });
  } else {
    alert("비밀번호가 틀렸습니다!");
  }
});
