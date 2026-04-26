import React, { useEffect, useState, useRef, useCallback } from 'react'
import Header from '../components/Header'
import AnimeGrid from '../components/AnimeGrid'
import SearchBar from '../components/SearchBar'
import ErrorBoundary from '../components/ErrorBoundary'
import { getTopAnime } from '../api/Api'
import { motion } from 'framer-motion'
import { BiChevronUpCircle } from 'react-icons/bi'
import { useNSFW } from '../features/NSFWContext'

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

const Top: React.FC = () => {
  const { allowNSFW } = useNSFW()
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const title = document.querySelector('title')
    if (title) title.textContent = 'Top Anime - Cleanime'
  }, [])

  // Reset pagination when NSFW filter changes
  useEffect(() => {
    setPage(1)
    setAnimes([])
    setHasMore(true)
  }, [allowNSFW])

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true)
      const res = await getTopAnime(page, allowNSFW)
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

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-b from-kitsune-gray to-kitsune-black py-12 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-black font-display mb-4">
              <span className="text-kitsune-pink">TOP</span>
              <span className="text-white ml-2">RATED</span>
            </h1>
            <p className="text-gray-400 text-lg">Best anime of all time</p>
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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center py-12"
          >
            <div className="text-kitsune-pink font-bold text-xl">Loading more...</div>
          </motion.div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="py-12 flex justify-center">
          {!hasMore && animes.length > 0 && (
            <div className="text-gray-500 text-lg">No more anime to load</div>
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

export default Top
