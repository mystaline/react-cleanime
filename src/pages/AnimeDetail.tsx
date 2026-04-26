import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import ErrorBoundary from '../components/ErrorBoundary'
import { getAnimeById } from '../api/Api'
import { motion } from 'framer-motion'
import { BiPlay, BiStar, BiCalendar } from 'react-icons/bi'

interface Studio {
  mal_id: number
  name: string
}

interface Genre {
  mal_id: number
  name: string
}

interface Anime {
  mal_id: number
  title: string
  title_english?: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  score: number
  scored_by?: number
  rank?: number
  episodes?: number
  status?: string
  aired?: {
    from?: string
    to?: string
  }
  synopsis?: string
  genres?: Genre[]
  studios?: Studio[]
  source?: string
  rating?: string
  season?: string
  year?: number
  type?: string
  duration?: string
}

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnime = async () => {
      if (id) {
        setLoading(true)
        const res = await getAnimeById(id)
        if (res) {
          setAnime(res.data)
          const title = document.querySelector('title')
          if (title) title.textContent = `${res.data.title} - Cleanime`
        }
        setLoading(false)
      }
    }

    fetchAnime()
  }, [id])

  if (loading) {
    return (
      <div className="bg-kitsune-black min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-kitsune-pink font-bold text-2xl"
          >
            Loading anime details...
          </motion.div>
        </div>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="bg-kitsune-black min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-400 text-xl">Anime not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-kitsune-black min-h-screen">
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-b from-kitsune-gray to-kitsune-black py-12 overflow-hidden"
      >
        {/* Floating background elements */}
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-20 right-10 w-96 h-96 bg-kitsune-pink rounded-full blur-3xl opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-kitsune-lime rounded-full blur-3xl opacity-5"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1"
            >
              <div className="relative group">
                <motion.img
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full rounded-lg shadow-2xl border-2 border-kitsune-pink/30"
                  whileHover={{ scale: 1.05, borderColor: '#FF006E' }}
                  transition={{ duration: 0.3 }}
                />
                {anime.score && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute top-4 right-4 bg-kitsune-pink text-black rounded-full p-3 flex items-center gap-2 font-bold text-lg shadow-lg"
                  >
                    <BiStar /> {anime.score}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-black font-display mb-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-kitsune-pink to-kitsune-lime">
                      {anime.title}
                    </span>
                  </h1>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <p className="text-gray-400 text-lg italic">{anime.title_english}</p>
                  )}
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {anime.type && (
                    <motion.div whileHover={{ x: 5 }} className="bg-kitsune-gray/50 p-3 rounded border border-kitsune-pink/20">
                      <p className="text-gray-500 text-sm uppercase tracking-wider">Type</p>
                      <p className="text-kitsune-lime font-bold mt-1">{anime.type}</p>
                    </motion.div>
                  )}
                  {anime.episodes && (
                    <motion.div whileHover={{ x: 5 }} className="bg-kitsune-gray/50 p-3 rounded border border-kitsune-lime/20">
                      <p className="text-gray-500 text-sm uppercase tracking-wider">Episodes</p>
                      <p className="text-kitsune-lime font-bold mt-1">{anime.episodes}</p>
                    </motion.div>
                  )}
                  {anime.status && (
                    <motion.div whileHover={{ x: 5 }} className="bg-kitsune-gray/50 p-3 rounded border border-kitsune-pink/20">
                      <p className="text-gray-500 text-sm uppercase tracking-wider">Status</p>
                      <p className="text-white font-bold mt-1">{anime.status}</p>
                    </motion.div>
                  )}
                  {anime.aired?.from && (
                    <motion.div whileHover={{ x: 5 }} className="bg-kitsune-gray/50 p-3 rounded border border-kitsune-lime/20 col-span-2 md:col-span-1">
                      <p className="text-gray-500 text-sm uppercase tracking-wider flex items-center gap-1">
                        <BiCalendar className="text-kitsune-lime" /> Aired
                      </p>
                      <p className="text-white font-bold mt-1 text-sm">{anime.aired.from}</p>
                    </motion.div>
                  )}
                  {anime.season && anime.year && (
                    <motion.div whileHover={{ x: 5 }} className="bg-kitsune-gray/50 p-3 rounded border border-kitsune-pink/20 col-span-2 md:col-span-1">
                      <p className="text-gray-500 text-sm uppercase tracking-wider">Season</p>
                      <p className="text-white font-bold mt-1">
                        {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#FF006E' }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-kitsune-pink text-kitsune-pink font-bold uppercase hover:text-black transition-all rounded"
                >
                  <BiPlay className="text-2xl" />
                  Watch Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Details Section */}
      <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Synopsis */}
            {anime.synopsis && (
              <div>
                <h2 className="text-2xl font-black font-display text-kitsune-pink mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed text-lg">{anime.synopsis}</p>
              </div>
            )}

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div>
                <h2 className="text-2xl font-black font-display text-kitsune-lime mb-4">Genres</h2>
                <div className="flex flex-wrap gap-3">
                  {anime.genres.map((genre, idx) => (
                    <motion.div
                      key={genre.mal_id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-kitsune-pink/20 to-kitsune-lime/20 border border-kitsune-pink/40 rounded-full text-white font-semibold"
                    >
                      {genre.name}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Rating Info */}
            {anime.score && (
              <div className="bg-gradient-to-br from-kitsune-pink/10 to-kitsune-gray/30 border border-kitsune-pink/30 rounded-lg p-6">
                <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-2">Score</h3>
                <p className="text-4xl font-black text-kitsune-pink">{anime.score}</p>
                {anime.scored_by && <p className="text-xs text-gray-400 mt-2">{anime.scored_by.toLocaleString()} votes</p>}
              </div>
            )}

            {/* Rank */}
            {anime.rank && (
              <div className="bg-gradient-to-br from-kitsune-lime/10 to-kitsune-gray/30 border border-kitsune-lime/30 rounded-lg p-6">
                <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-2">Rank</h3>
                <p className="text-4xl font-black text-kitsune-lime">#{anime.rank}</p>
              </div>
            )}

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="bg-kitsune-gray/30 border border-white/10 rounded-lg p-6">
                <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Studios</h3>
                <div className="space-y-2">
                  {anime.studios.map((studio) => (
                    <p key={studio.mal_id} className="text-white font-semibold hover:text-kitsune-pink transition-colors">
                      {studio.name}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Source & Rating */}
            <div className="grid grid-cols-2 gap-4">
              {anime.source && (
                <div className="bg-kitsune-gray/30 border border-white/10 rounded-lg p-4">
                  <p className="text-xs uppercase text-gray-400 mb-2">Source</p>
                  <p className="text-white font-bold text-sm">{anime.source}</p>
                </div>
              )}
              {anime.rating && (
                <div className="bg-kitsune-gray/30 border border-white/10 rounded-lg p-4">
                  <p className="text-xs uppercase text-gray-400 mb-2">Rating</p>
                  <p className="text-white font-bold text-sm">{anime.rating}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      </ErrorBoundary>
    </div>
  )
}

export default AnimeDetail
