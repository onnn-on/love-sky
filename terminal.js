import { supabase } from "./supabase.js";
import { getUserRole } from "./auth.js";

const role = await getUserRole();
if (role !== "admin") {
  alert("无权限访问");
  window.location.href = "/";
}

async function loadAllMessages() {
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  let html = "";
  data.forEach(m => {
    html += `
      <div class="message">
        <small>${m.sender} → ${m.receiver}</small>
        <p>${m.content}</p>
        ${m.reply ? `<p class="reply">回复: ${m.reply}</p>` : ""}
        <small>${new Date(m.created_at).toLocaleString()}</small>
      </div>
    `;
  });
  document.getElementById("all-messages").innerHTML = html || "暂无消息";
}

async function loadAllCapsules() {
  const { data } = await supabase.from("capsules").select("*").order("created_at", { ascending: false });
  let html = "";
  data.forEach(c => {
    html += `
      <div class="message">
        <p>拥有者: ${c.owner}</p>
        <p>内容: ${c.opened ? c.content : "未开启"}</p>
        <small>创建于 ${new Date(c.created_at).toLocaleString()} | 开启日期: ${c.open_date}</small>
      </div>
    `;
  });
  document.getElementById("all-capsules").innerHTML = html || "暂无胶囊";
}

loadAllMessages();
loadAllCapsules();