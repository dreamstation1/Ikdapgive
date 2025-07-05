window.onload = () => {
  const savedName = localStorage.getItem("guestName");
  if (savedName) {
    document.getElementById("nameInput").value = savedName;
    showMessageSection();
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
    fetch("/api/messages", {
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
