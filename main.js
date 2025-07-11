// supabase 연결
const supabase = window.supabase.createClient(
  'https://pekkymttpwmfvuxbgskf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBla2t5bXR0cHdtZnZ1eGJnc2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTE0NTUsImV4cCI6MjA2NzM4NzQ1NX0.jpIY3TPOI-HDHnPe6llBPJUyOK1U80_nC6wl2_TMYLA'
);


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nameBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value.trim();
    if (name) {
      localStorage.setItem("guestName", name);
      showOnly("messageSection");
    } else {
      alert("이름을 입력해주세요!");
    }
  });

  document.getElementById("sendBtn").addEventListener("click", async () => {
    const name = localStorage.getItem("guestName");
    const message = document.getElementById("messageInput").value.trim();
    const userAgent = navigator.userAgent;
    const ip = 'unknown';

    if (message) {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ name, message, ip, userAgent }]);

      if (error) {
        console.error('저장 실패', error);
        alert('메시지 저장 실패!');
      } else {
        console.log('저장 성공', data);
        alert('메시지 저장 완료!');
        document.getElementById("messageInput").value = "";
        showOnly("successSection");
      }
    } else {
      alert("메시지를 입력해주세요!");
    }
  });

  document.getElementById("anotherBtn").addEventListener("click", () => {
    showOnly("messageSection");
  });

  document.getElementById("adminBtn").addEventListener("click", () => {
    showOnly("adminSection");
  });

  document.getElementById("checkPassBtn").addEventListener("click", async () => {
    const pass = document.getElementById("adminPass").value;
    if (pass === "5263815731abc!") {
      const { data, error } = await supabase
        .from('messages')
        .select('*');

      if (error) {
        console.error('불러오기 실패', error);
        return;
      }

      console.log('모든 메시지:', data);
      showOnly("allMessages");

      const tbody = document.querySelector("#msgTable tbody");
      tbody.innerHTML = "";
      data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.name}</td>
          <td>${item.message}</td>
          <td>${item.created_at || "-"}</td>
          <td>${item.ip || "-"}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      alert("비밀번호가 틀렸습니다!");
    }
  });

  function showOnly(sectionId) {
    document.querySelectorAll(".wrapper").forEach(div => {
      div.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
  }
});
