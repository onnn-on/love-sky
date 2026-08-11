import { supabase } from "./supabase.js";

let list = [];
let index = 0;

async function load() {
  const { data } = await supabase.from("music").select("*");
  list = data;
  show();
  const audio = document.getElementById("player");
  audio.onplay = () => {
    const aurora = document.getElementById("aurora");
    if (aurora) aurora.style.opacity = "1";
  };
  audio.onpause = () => {
    const aurora = document.getElementById("aurora");
    if (aurora) aurora.style.opacity = "0";
  };
}

function show() {
  if (!list.length) return;
  const song = list[index];
  document.getElementById("title").innerText = song.name;
  document.getElementById("artist").innerText = song.artist;
  document.getElementById("cover").src = song.cover;
  document.getElementById("player").src = song.url;
}

function next() {
  index = (index + 1) % list.length;
  show();
}

window.next = next;
load();