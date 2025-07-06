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
