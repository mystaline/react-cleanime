import React, { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import AnimeGrid from '../components/AnimeGrid'
import SearchBar from '../components/SearchBar'
import ErrorBoundary from '../components/ErrorBoundary'
import { getSeasonAnime } from '../api/Api'
import { motion } from 'framer-motion'
import { BiPlay, BiChevronUpCircle } from 'react-icons/bi'
import { useNSFW } from '../features/NSFWContext'
import useSEO from '../hooks/useSEO'

interface Anime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
    }
  }
  score: number
  status?: string
}

const Current: React.FC = () => {
  const { allowNSFW } = useNSFW()
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(true)

  useSEO({ title: 'Now Airing', description: "This season's hottest anime releases currently airing." })

  // Reset pagination when NSFW filter changes
  useEffect(() => {
    setPage(1)
    setAnimes([])
    setHasMore(true)
  }, [allowNSFW])

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true)
      const res = await getSeasonAnime(page, allowNSFW)
      if (res) {
        setAnimes(prev => page === 1 ? res.data : [...prev, ...res.data])
        setHasMore(res.data.length > 0)
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }

    fetchData()
  }, [page, allowNSFW])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [hasMore, loading])

  return (
    <div className="bg-kitsune-black min-h-screen">
      <Header />

      {/* Kinetic Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-kitsune-gray via-kitsune-black to-kitsune-black py-12 md:py-20 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-kitsune-lime to-transparent rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tl from-kitsune-pink to-transparent rounded-full blur-3xl opacity-10"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BiPlay className="text-kitsune-lime text-4xl" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black font-display">
                <span className="text-kitsune-lime">NOW</span>
                <span className="text-white ml-2">AIRING</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg">This season's hottest releases</p>
          </motion.div>

          <SearchBar />
        </div>
      </motion.section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {animes.length > 0 && (
          <ErrorBoundary>
            <AnimeGrid animes={animes} />
          </ErrorBoundary>
        )}

        {loading && page > 1 && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center py-12"
          >
            <div className="text-kitsune-lime font-bold text-xl">Loading more episodes...</div>
          </motion.div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="py-12 flex justify-center">
          {!hasMore && animes.length > 0 && (
            <div className="text-gray-500 text-lg">No more episodes to load</div>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-kitsune-pink hover:bg-kitsune-lime text-black rounded-full transition-all hover:scale-110 z-40"
      >
        <BiChevronUpCircle size={24} />
      </motion.button>
    </div>
  )
}

export default Current
