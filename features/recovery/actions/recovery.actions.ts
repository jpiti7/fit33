"use server";

import { revalidatePath } from "next/cache";

import {
  findLatestRecoveryCheckin,
  upsertRecoveryCheckin,
} from "@/features/recovery/repositories/recovery.repository";
import type { RecoveryInput } from "@/features/recovery/types";
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

export async function getLatestRecoveryAction() {
  const { supabase, user } = await authenticated();
  return findLatestRecoveryCheckin(supabase, user.id);
}

export async function saveRecoveryAction(input: RecoveryInput) {
  try {
    const { supabase, user } = await authenticated();
    const checkin = await upsertRecoveryCheckin(supabase, user.id, input);
    revalidatePath("/");
    revalidatePath("/recuperacion");
    revalidatePath("/planificacion");
    return { success: true as const, checkin };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo guardar la recuperación.",
    };
  }
}
