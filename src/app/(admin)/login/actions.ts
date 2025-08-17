"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  console.log("[Admin Login] Starting login process");
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log("[Admin Login] Attempting login for email:", data.email);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("[Admin Login] Authentication error:", error);
    if (error.message === "No user found") {
      return { status: 400 };
    }
    return { status: 401 };
  }
  console.log("[Admin Login] Successfully authenticated with password");

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.error("[Admin Login] No session found after authentication");
    return { status: 500 };
  }
  console.log("[Admin Login] Session obtained for user:", session.user.id);

  console.log("[Admin Login] Login process completed successfully");
  revalidatePath("/admin", "layout");
  return {
    status: 200,
    message: "Login successful",
    redirectTo: "/admin",
  };
} 