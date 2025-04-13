"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function AccountSaver() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.email) {
      // Save account to localStorage
      const accounts = localStorage.getItem("microsoftAccounts")
      let savedAccounts = []

      if (accounts) {
        try {
          savedAccounts = JSON.parse(accounts)
        } catch (e) {
          console.error("Failed to parse saved accounts", e)
        }
      }

      // Check if account already exists
      const existingAccountIndex = savedAccounts.findIndex((account: any) => account.email === session.user.email)

      const accountData = {
        email: session.user.email,
        name: session.user.name,
        lastUsed: Date.now(),
      }

      if (existingAccountIndex >= 0) {
        // Update existing account
        savedAccounts[existingAccountIndex] = accountData
      } else {
        // Add new account
        savedAccounts.push(accountData)
      }

      // Sort by last used (most recent first)
      savedAccounts.sort((a: any, b: any) => b.lastUsed - a.lastUsed)

      // Limit to 5 accounts
      if (savedAccounts.length > 5) {
        savedAccounts = savedAccounts.slice(0, 5)
      }

      localStorage.setItem("microsoftAccounts", JSON.stringify(savedAccounts))
    }
  }, [session])

  return null
}
