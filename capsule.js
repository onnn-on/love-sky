import { supabase } from "./supabase.js";
import { getUser } from "./auth.js";

async function save() {
  const user = await getUser();
  if (!user) return alert("请先登录");
  const content = document.getElementById("text").value;
  const open_date = document.getElementById("date").value;
  if (!content || !open_date) return alert("请填写内容和开启日期");
  const { error } = await supabase.from("capsules").insert({
    owner: user.id,
    content,
    open_date
  });
  if (error) {
    document.getElementById("result").innerHTML = "封存失败: " + error.message;
  } else {
    document.getElementById("result").innerHTML = "✨ 胶囊已埋入星空，将在 " + open_date + " 开启";
    document.getElementById("text").value = "";
    document.getElementById("date").value = "";
    loadCapsules();
  }
}

async function loadCapsules() {
  const user = await getUser();
  if (!user) return;
  const { data } = await supabase
    .from("capsules")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });
  let html = "";
  data.forEach(c => {
    const canOpen = c.open_date <= new Date().toISOString().slice(0, 10) && !c.opened;
    html += `
      <div class="message">
        <small>封存于 ${new Date(c.created_at).toLocaleDateString()}</small>
        <p>开启日期: ${c.open_date}</p>
        ${canOpen
          ? `<p>📜 ${c.content}</p><button onclick="markOpened(${c.id})">已阅</button>`
          : `<p>⏰ 尚未到开启日期</p>`
        }
      </div>
    `;
  });
  document.getElementById("capsules").innerHTML = html;
}

async function markOpened(id) {
  await supabase.from("capsules").update({ opened: true }).eq("id", id);
  loadCapsules();
}

async function checkTodayCapsule() {
  const user = await getUser();
  if (!user) return;
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("capsules")
    .select("*")
    .eq("owner", user.id)
    .eq("open_date", today)
    .eq("opened", false);
  if (data && data.length > 0) {
    data.forEach(c => {
      alert(`⏳ 来自过去的一封信：\n\n${c.content}`);
      supabase.from("capsules").update({ opened: true }).eq("id", c.id);
    });
    loadCapsules();
  }
}

window.save = save;
window.markOpened = markOpened;
loadCapsules();
checkTodayCapsule();