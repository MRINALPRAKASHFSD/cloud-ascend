import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Claim admin role. Only succeeds when no admin exists yet (bootstrap),
// or when the caller is already an admin.
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Any existing admin?
    const { data: existingAdmins, error: countErr } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1);
    if (countErr) throw countErr;

    if (existingAdmins && existingAdmins.length > 0) {
      // Not the bootstrap moment — is the caller already an admin?
      const { data: mine } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "admin")
        .eq("user_id", userId)
        .maybeSingle();
      if (!mine) {
        return { ok: false as const, reason: "not_bootstrap" as const };
      }
      return { ok: true as const, alreadyAdmin: true };
    }

    // Bootstrap — call needs to bypass RLS. Load the service client here.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (error) throw error;
    return { ok: true as const, bootstrapped: true };
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    return {
      userId,
      isAdmin: (data ?? []).some((r) => r.role === "admin"),
      isEditor: (data ?? []).some((r) => r.role === "editor"),
    };
  });
