import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import AnimeGrid from '../components/AnimeGrid'
import ErrorBoundary from '../components/ErrorBoundary'
import { getSearch } from '../api/Api'
import { motion } from 'framer-motion'
import { BiSearch, BiChevronUpCircle } from 'react-icons/bi'
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
}

const Search: React.FC = () => {
  const { name } = useParams<{ name: string }>()
  const { allowNSFW } = useNSFW()
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(true)
  const decoded = decodeURIComponent(name ?? '')

  useSEO({
    title: `Search: ${decoded}`,
    description: `Anime search results for "${decoded}" on Cleanime.`,
  })

  useEffect(() => {
    setPage(1)
    setAnimes([])
    setHasMore(true)
  }, [name])

  // Reset pagination when NSFW filter changes
  useEffect(() => {
    setPage(1)
    setAnimes([])
    setHasMore(true)
  }, [allowNSFW])

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true)
      if (name) {
        const res = await getSearch(decodeURIComponent(name), page, allowNSFW)
        if (res) {
          setAnimes(prev => page === 1 ? res.data : [...prev, ...res.data])
          setHasMore(res.data.length > 0)
        } else {
          setHasMore(false)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [name, page, allowNSFW])

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

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-kitsune-gray via-kitsune-black to-kitsune-black py-12 md:py-20 overflow-hidden"
      >
        {/* Animated search icon background */}
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-10 right-20 pointer-events-none"
        >
          <BiSearch className="text-8xl text-kitsune-pink opacity-10" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 40, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-10 left-20 pointer-events-none"
        >
          <BiSearch className="text-7xl text-kitsune-lime opacity-10" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BiSearch className="text-5xl text-kitsune-lime" />
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black font-display mb-4">
              <span className="text-white">SEARCH</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-kitsune-pink to-kitsune-lime">
                RESULTS
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Found results for{' '}
              <span className="text-kitsune-pink font-bold">"{decoded}"</span>
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        {animes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-kitsune-gray/30 border-l-4 border-kitsune-lime rounded flex items-center gap-3"
          >
            <BiSearch className="text-2xl text-kitsune-lime flex-shrink-0" />
            <p className="text-gray-300">
              Showing <span className="text-kitsune-lime font-bold">{animes.length}</span> results
            </p>
          </motion.div>
        )}

        {/* Grid */}
        {animes.length > 0 && (
          <ErrorBoundary>
            <AnimeGrid animes={animes} />
          </ErrorBoundary>
        )}

        {/* Loading State */}
        {loading && page === 1 && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center py-12"
          >
            <div className="text-kitsune-lime font-bold text-xl">Searching...</div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && animes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4 opacity-30"
            >
              <BiSearch className="text-kitsune-gray" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500 text-lg">
              Try a different search term or browse other sections
            </p>
          </motion.div>
        )}

        {loading && page > 1 && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center py-12"
          >
            <div className="text-kitsune-lime font-bold text-xl">Loading more results...</div>
          </motion.div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="py-12 flex justify-center">
          {!hasMore && animes.length > 0 && (
            <div className="text-gray-500 text-lg">No more results to load</div>
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

export default Search
