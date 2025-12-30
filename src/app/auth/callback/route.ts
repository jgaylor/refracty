import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/auth";
import { getPeople, createSamplePerson } from "@/lib/supabase/people";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // Check if user is new (has no people) and create sample person
    try {
      const user = await getUser();
      if (user) {
        const people = await getPeople();
        if (people.length === 0) {
          // New user with no people, create sample person
          await createSamplePerson();
        }
      }
    } catch (error) {
      // Don't block auth flow if sample creation fails
      console.error('Error creating sample person:', error);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url));
}

