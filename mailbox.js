import { supabase } from "./supabase.js";
import { getUser } from "./auth.js";

const ADMIN_ID = "823ceb94-1e2b-49b6-81a5-681c922f9e20";

async function sendNew() {
  const user = await getUser();
  if (!user) return alert("请先登录");
  const content = document.getElementById("newContent").value;
  if (!content) return alert("请输入内容");
  const { error } = await supabase.from("messages").insert({
    sender: user.id,
    receiver: ADMIN_ID,
    content
  });
  if (error) {
    alert("发送失败: " + error.message);
  } else {
    document.getElementById("newContent").value = "";
    loadMessages();
  }
}

async function loadMessages() {
  const user = await getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    document.getElementById("messages").innerHTML = "加载失败";
    return;
  }
  let html = "";
  data.forEach(m => {
    html += `
      <div class="message">
        <p>${m.content}</p>
        <small>${new Date(m.created_at).toLocaleString()}</small>
        ${m.reply ? `<p class="reply">💬 回复: ${m.reply}</p>` : ""}
        <textarea id="reply-${m.id}" placeholder="回复..."></textarea>
        <button onclick="replyMsg(${m.id})">发送回复</button>
      </div>
    `;
  });
  document.getElementById("messages").innerHTML = html || "暂无信件";
}

async function replyMsg(id) {
  const reply = document.getElementById(`reply-${id}`).value;
  if (!reply) return alert("请输入回复内容");
  const { error } = await supabase
    .from("messages")
    .update({ reply, read: true })
    .eq("id", id);
  if (error) {
    alert("回复失败");
  } else {
    loadMessages();
  }
}

const channel = supabase
  .channel("new-message")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
    if (payload.new.receiver === supabase.auth.user()?.id) {
      alert("✨ 收到一封新信");
      loadMessages();
    }
  })
  .subscribe();

window.sendNew = sendNew;
window.replyMsg = replyMsg;

loadMessages();

window.addEventListener("beforeunload", () => {
  supabase.removeChannel(channel);
});
