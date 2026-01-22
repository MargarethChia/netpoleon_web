'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.message === 'No user found') {
      return { status: 400 };
    }
    return { status: 401 };
  }

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { status: 500 };
  }

  revalidatePath('/admin', 'layout');
  return {
    status: 200,
    message: 'Login successful',
    redirectTo: '/admin',
  };
}
