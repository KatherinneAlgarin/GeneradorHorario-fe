import { supabase } from "./supabaseClient";

export const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const userId = user.id;

  // 1️⃣ Buscar en docente
  const { data: docente } = await supabase
    .from("docente")
    .select("id_docente")
    .eq("id_auth_user", userId)
    .maybeSingle();

  if (docente) {
    return { rol: "docente" };
  }

  // 2️⃣ Buscar en administrador
  const { data: admin } = await supabase
    .from("administrador")
    .select("id_facultad")
    .eq("id_auth_user", userId)
    .maybeSingle();

  if (admin) {
    if (admin.id_facultad === null) {
      return { rol: "admin_general" };
    } else {
      return { rol: "decano" };
    }
  }

  return null;
};