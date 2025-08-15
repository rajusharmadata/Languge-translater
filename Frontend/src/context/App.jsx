import React, { useState, createContext } from 'react'

// Create context
export const AppContext = createContext()

const AppProvider = ({ children }) => {
  const [isopen, setIsOpen] = useState(false)

  return (
    <AppContext.Provider value={{ isopen, setIsOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
