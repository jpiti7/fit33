import type { SupabaseClient } from "@supabase/supabase-js";

export async function listProgressPhotos(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("progress_photos")
    .select("id, storage_path, taken_at, weight, note, created_at")
    .order("taken_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar las fotos: ${error.message}`);
  }

  return data ?? [];
}

export async function insertProgressPhoto(
  supabase: SupabaseClient,
  input: {
    userId: string;
    storagePath: string;
    takenAt: string;
    weight: number | null;
    note: string | null;
  },
) {
  const { error } = await supabase.from("progress_photos").insert({
    user_id: input.userId,
    storage_path: input.storagePath,
    taken_at: input.takenAt,
    weight: input.weight,
    note: input.note,
  });

  if (error) {
    throw new Error(`No se pudo guardar la foto: ${error.message}`);
  }
}

export async function deleteProgressPhotoRow(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("progress_photos")
    .delete()
    .eq("id", id)
    .select("storage_path")
    .single();

  if (error) {
    throw new Error(`No se pudo eliminar la foto: ${error.message}`);
  }

  return data;
}
