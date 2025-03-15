'use client'

import React, { createContext, useContext, useState } from 'react'

type UserContextProviderProps = {
  children: React.ReactNode
}

type User = any

type UserContext = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>> // string 중에서도 Theme만 pass
}

export const UserContext = createContext<UserContext | null>(null) // Context 밖에서 사용하면 null일 수 있다.

export default function ThemeContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>('light')

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a ThemeContextProvider')
  }
  return context
}
