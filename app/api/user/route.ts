import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.json(null, { status: 401 });
  }
  // Devuelve solo id y email
  return NextResponse.json({ id: data.user.id, email: data.user.email });
}
