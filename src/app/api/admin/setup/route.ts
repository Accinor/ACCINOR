import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const admin = getAdminClient()
    const results: string[] = []

    // Create avatars storage bucket
    const { data: bucket, error: bucketError } = await admin.storage.createBucket("avatars", {
      public: true,
      fileSizeLimit: 5242880,
    })

    if (bucketError) {
      if (bucketError.message?.includes("already exists")) {
        results.push("Storage bucket 'avatars' already exists")
      } else {
        results.push(`Storage bucket error: ${bucketError.message}`)
      }
    } else {
      results.push("Storage bucket 'avatars' created")
    }

    // Try to make bucket public if it already existed
    if (bucketError?.message?.includes("already exists")) {
      const { error: updateError } = await admin.storage.updateBucket("avatars", {
        public: true,
        fileSizeLimit: 5242880,
      })
      if (updateError) {
        results.push(`Update bucket error: ${updateError.message}`)
      } else {
        results.push("Storage bucket 'avatars' updated to public")
      }
    }

    results.push("Profile table extensions (avatar_url, bio, profile_type, etc.) must be applied manually via Supabase Dashboard > SQL Editor using supabase/migrations/00003_profiles_extend.sql")

    return NextResponse.json({ results })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Setup failed" }, { status: 500 })
  }
}
