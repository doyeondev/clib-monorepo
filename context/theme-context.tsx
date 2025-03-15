'use client'

import React, { createContext, useContext, useState } from 'react'

type ThemeContextProviderProps = {
  children: React.ReactNode
}

type Theme = 'dark' | 'light'

type ThemeContext = {
  theme: Theme
  setTheme: React.Dispatch<React.SetStateAction<Theme>> // string 중에서도 Theme만 pass
}

export const ThemeContext = createContext<ThemeContext | null>(null) // Context 밖에서 사용하면 null일 수 있다.

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider')
  }
  return context
}
