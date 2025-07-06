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
    showMessageSection();
  } else {
    alert("이름을 입력해주세요!");
  }
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value.trim();
  const name = localStorage.getItem("guestName");

  if (message) {
    fetch("https://ikdapgive-z87w.vercel.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, message })
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

document.getElementById("anotherBtn").addEventListener("click", () => {
  document.getElementById("successSection").classList.add("hidden");
  document.getElementById("messageSection").classList.remove("hidden");
});

function showMessageSection() {
  document.getElementById("nameSection").classList.add("hidden");
  document.getElementById("messageSection").classList.remove("hidden");
}

document.getElementById("adminBtn").addEventListener("click", () => {
  document.getElementById("adminSection").classList.remove("hidden");
});

document.getElementById("checkPassBtn").addEventListener("click", () => {
  const pass = document.getElementById("adminPass").value;

  if (pass === "5263815731abc!") {  // ← 관리자 비번
    fetch("https://너의URL.vercel.app/api/messages")
      .then(res => res.json())
      .then(data => {
        document.getElementById("adminSection").classList.add("hidden");
        document.getElementById("allMessages").classList.remove("hidden");

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
