import { supabase } from "@/lib/supabase";
import { emptySections, type CvMaster } from "@/features/cv-builder/types";

export async function listCvMasters(): Promise<CvMaster[]> {
  const { data, error } = await supabase
    .from("cv_master")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as CvMaster[];
}

export async function getCvMaster(id: string): Promise<CvMaster> {
  const { data, error } = await supabase.from("cv_master").select("*").eq("id", id).single();

  if (error) throw error;
  return data as CvMaster;
}

export async function createCvMaster(name: string, userId: string): Promise<CvMaster> {
  const { data, error } = await supabase
    .from("cv_master")
    .insert({
      name,
      user_id: userId,
      region_profile: "international",
      sections: emptySections,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CvMaster;
}

export async function updateCvMaster(
  id: string,
  patch: Partial<Pick<CvMaster, "name" | "sections" | "region_profile">>,
): Promise<CvMaster> {
  const { data, error } = await supabase
    .from("cv_master")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CvMaster;
}

export async function deleteCvMaster(id: string): Promise<void> {
  const { error } = await supabase.from("cv_master").delete().eq("id", id);
  if (error) throw error;
}
