// src/utils/roles.ts
import { createClient } from '@supabase/supabase-js';
import { Roles } from '@/types/globals';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const getRoleFromDb = async (userId: string): Promise<Roles | undefined> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('uuid', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching role:', error);
    return undefined;
  }

  return data.role as Roles;
};

export const checkRoleFromDb = async (userId: string, role: Roles): Promise<boolean> => {
  const userRole = await getRoleFromDb(userId);
  return userRole === role;
};
