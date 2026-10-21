"use client"

import { accountApi, forgetAccount, type AccountApi } from "@/lib/auth/browser"

/** Ends the session, forgets the header's marker, and leaves for the home page. */
export async function logOutAndLeave(
  api: AccountApi = accountApi,
  navigate: (to: string) => void = (to) => window.location.assign(to)
) {
  await api.signOut()
  forgetAccount()
  navigate("/")
}
