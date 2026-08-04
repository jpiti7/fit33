"use server";

import { revalidatePath } from "next/cache";

import {
  deleteProgressPhotoRow,
  insertProgressPhoto,
  listProgressPhotos,
} from "@/features/progress-photos/repositories/progress-photo.repository";
import type { ProgressPhoto } from "@/features/progress-photos/types";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function authenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
  }

  return { supabase, user };
}

export async function getProgressPhotosAction(): Promise<ProgressPhoto[]> {
  const { supabase } = await authenticatedClient();
  const rows = await listProgressPhotos(supabase);

  return Promise.all(
    rows.map(async (row) => {
      const { data } = await supabase.storage
        .from("progress-photos")
        .createSignedUrl(row.storage_path, 60 * 60);

      return {
        id: row.id,
        storagePath: row.storage_path,
        signedUrl: data?.signedUrl ?? "",
        takenAt: row.taken_at,
        weight: row.weight === null ? null : Number(row.weight),
        note: row.note,
        createdAt: row.created_at,
      };
    }),
  );
}

export async function uploadProgressPhotoAction(formData: FormData) {
  const { supabase, user } = await authenticatedClient();
  const file = formData.get("photo");
  const takenAt = String(
    formData.get("takenAt") || new Date().toISOString().slice(0, 10),
  );
  const weightValue = String(formData.get("weight") || "").replace(",", ".");
  const note = String(formData.get("note") || "").trim();

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Selecciona una fotografía.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Usa una imagen JPG, PNG o WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("La fotografía no puede superar 10 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("progress-photos")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
  }

  try {
    await insertProgressPhoto(supabase, {
      userId: user.id,
      storagePath,
      takenAt,
      weight: weightValue ? Number(weightValue) : null,
      note: note || null,
    });
  } catch (error) {
    await supabase.storage.from("progress-photos").remove([storagePath]);
    throw error;
  }

  revalidatePath("/progreso");
  revalidatePath("/progreso/fotos");
}

export async function deleteProgressPhotoAction(id: string) {
  const { supabase } = await authenticatedClient();
  const row = await deleteProgressPhotoRow(supabase, id);
  await supabase.storage.from("progress-photos").remove([row.storage_path]);
  revalidatePath("/progreso");
  revalidatePath("/progreso/fotos");
}
