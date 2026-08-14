import { supabase } from "@/lib/supabase";

export interface UserSettings {
  ai_key_encrypted: string | null;
  ai_key_iv: string | null;
  ai_key_provider: string | null;
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("ai_key_encrypted, ai_key_iv, ai_key_provider")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return (
    data ?? {
      ai_key_encrypted: null,
      ai_key_iv: null,
      ai_key_provider: null,
    }
  );
}

export async function upsertUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
): Promise<void> {
  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, ...settings }, { onConflict: "user_id" });

  if (error) throw error;
}
