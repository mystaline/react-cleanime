import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface NSFWContextType {
  allowNSFW: boolean
  setAllowNSFW: (allow: boolean) => void
}

const NSFWContext = createContext<NSFWContextType | undefined>(undefined)

export const NSFWProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allowNSFW, setAllowNSFWState] = useState(false)

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('allowNSFW')
    if (stored !== null) {
      setAllowNSFWState(stored === 'true')
    }
  }, [])

  const setAllowNSFW = (allow: boolean) => {
    setAllowNSFWState(allow)
    sessionStorage.setItem('allowNSFW', String(allow))
  }

  return (
    <NSFWContext.Provider value={{ allowNSFW, setAllowNSFW }}>
      {children}
    </NSFWContext.Provider>
  )
}

export const useNSFW = (): NSFWContextType => {
  const context = useContext(NSFWContext)
  if (!context) {
    throw new Error('useNSFW must be used within NSFWProvider')
  }
  return context
}

export default NSFWContext
