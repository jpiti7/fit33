"use server";

import { revalidatePath } from "next/cache";

import {
  findLatestHealthSnapshot,
  upsertHealthSnapshot,
} from "@/features/health/repositories/health.repository";
import type { AppleHealthSnapshot } from "@/features/health/types";
import { createClient } from "@/lib/supabase/server";

async function authenticated() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Tu sesión ha caducado.");
  return { supabase, user };
}

export async function getLatestHealthSnapshotAction() {
  const { supabase, user } = await authenticated();
  return findLatestHealthSnapshot(supabase, user.id);
}

export async function saveHealthSnapshotAction(snapshot: AppleHealthSnapshot) {
  try {
    const { supabase, user } = await authenticated();
    const stored = await upsertHealthSnapshot(supabase, user.id, snapshot);
    revalidatePath("/");
    revalidatePath("/salud");
    revalidatePath("/recuperacion");
    return { success: true as const, snapshot: stored };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo sincronizar Salud.",
    };
  }
}
