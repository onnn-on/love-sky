import { supabase } from "./supabase.js";

export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    nickname: email.split("@")[0]
  });
  if (profileError) {
    console.error("创建资料失败:", profileError);
  }
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserRole() {
  const user = await getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role;
}