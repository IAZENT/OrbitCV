import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/features/profile/types";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfile | null;
}

export async function upsertUserProfile(
  userId: string,
  profile: Partial<Omit<UserProfile, "user_id" | "created_at" | "updated_at">>,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      { user_id: userId, ...profile, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}
