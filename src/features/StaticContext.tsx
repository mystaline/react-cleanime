import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Anime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
    }
  }
  score: number
}

interface StaticContextType {
  topAnime: Anime[]
  setTopAnime: (anime: Anime[]) => void
  currentAnime: Anime[]
  setCurrentAnime: (anime: Anime[]) => void
  upcomingSeason: Anime[]
  setUpcomingSeason: (anime: Anime[]) => void
}

const StaticContext = createContext<StaticContextType | undefined>(undefined)

export const StaticProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topAnime, setTopAnime] = useState<Anime[]>([])
  const [currentAnime, setCurrentAnime] = useState<Anime[]>([])
  const [upcomingSeason, setUpcomingSeason] = useState<Anime[]>([])

  return (
    <StaticContext.Provider
      value={{
        topAnime,
        setTopAnime,
        currentAnime,
        setCurrentAnime,
        upcomingSeason,
        setUpcomingSeason,
      }}
    >
      {children}
    </StaticContext.Provider>
  )
}

export const useStatic = (): StaticContextType => {
  const context = useContext(StaticContext)
  if (!context) {
    throw new Error('useStatic must be used within StaticProvider')
  }
  return context
}

export default StaticContext
