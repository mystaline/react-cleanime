import React, { useEffect, useLayoutEffect, useState } from 'react'
import Header from '../components/Header'
import AnimeGrid from '../components/AnimeGrid'
import ErrorBoundary from '../components/ErrorBoundary'
import { BiChevronUpCircle } from 'react-icons/bi'
import { getSeasonAnime, getTopAnime, getUpcomingAnime } from '../api/Api'
import { Link } from 'react-router-dom'
import { useStatic } from '../features/StaticContext'
import { useNSFW } from '../features/NSFWContext'
import SearchBar from '../components/SearchBar'
import { motion } from 'framer-motion'

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

const Home: React.FC = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const {
    topAnime,
    setTopAnime,
    currentAnime,
    setCurrentAnime,
    upcomingSeason,
    setUpcomingSeason,
  } = useStatic()
  const { allowNSFW } = useNSFW()
  const items = windowSize < 768 ? 7 : 15

  useLayoutEffect(() => {
    const updateSize = () => {
      setWindowSize(window.innerWidth)
    }

    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  useEffect(() => {
    const title = document.querySelector('title')
    if (title) title.textContent = 'Cleanime - Anime Explorer'

    const getData = async () => {
      if (topAnime.length < 1) {
        const res = await getTopAnime(1, allowNSFW)
        if (res) {
          setTopAnime(res.data.slice(0, items))
        }
      }

      if (currentAnime.length < 1) {
        const res = await getSeasonAnime(1, allowNSFW)
        if (res) {
          setCurrentAnime(res.data.slice(0, items))
        }
      }

      if (upcomingSeason.length < 1) {
        const res = await getUpcomingAnime(1, allowNSFW)
        if (res) {
          setUpcomingSeason(res.data.slice(0, items))
        }
      }
    }

    getData()
  }, [items, topAnime.length, currentAnime.length, upcomingSeason.length, setTopAnime, setCurrentAnime, setUpcomingSeason, allowNSFW])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 60, damping: 20 },
    },
  }

  return (
    <div className="bg-kitsune-black min-h-screen">
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-b from-kitsune-gray to-kitsune-black py-12 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-black font-display mb-4">
              <span className="text-kitsune-pink">ANIME</span>
              <br />
              <span className="text-kitsune-lime">EXPLORER</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover trending, current, and upcoming anime with bold design and kinetic energy
            </p>
          </motion.div>

          <SearchBar />
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20">
        {/* Top Anime Section */}
        {topAnime.length > 0 && (
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black font-display mb-2">
                <span className="text-kitsune-pink">TOP</span>
                <span className="text-white ml-2">RANKED</span>
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-kitsune-pink to-kitsune-lime"></div>
            </div>
            <ErrorBoundary>
              <AnimeGrid animes={topAnime} />
            </ErrorBoundary>
            <Link
              to="/top"
              className="inline-block mt-8 px-8 py-3 bg-kitsune-pink text-black font-bold text-sm uppercase tracking-wider hover:bg-kitsune-lime transition-all hover:scale-105"
            >
              View All Top Anime →
            </Link>
          </motion.section>
        )}

        {/* Current Season Section */}
        {currentAnime.length > 0 && (
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black font-display mb-2">
                <span className="text-kitsune-lime">NOW</span>
                <span className="text-white ml-2">AIRING</span>
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-kitsune-lime to-kitsune-pink"></div>
            </div>
            <ErrorBoundary>
              <AnimeGrid animes={currentAnime} />
            </ErrorBoundary>
            <Link
              to="/current"
              className="inline-block mt-8 px-8 py-3 border-2 border-kitsune-lime text-kitsune-lime font-bold text-sm uppercase tracking-wider hover:bg-kitsune-lime hover:text-black transition-all hover:scale-105"
            >
              View All Current →
            </Link>
          </motion.section>
        )}

        {/* Upcoming Section */}
        {upcomingSeason.length > 0 && (
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black font-display mb-2">
                <span className="text-white">COMING</span>
                <span className="text-kitsune-pink ml-2">SOON</span>
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-kitsune-pink to-kitsune-lime"></div>
            </div>
            <ErrorBoundary>
              <AnimeGrid animes={upcomingSeason} />
            </ErrorBoundary>
            <Link
              to="/upcoming"
              className="inline-block mt-8 px-8 py-3 bg-kitsune-pink text-black font-bold text-sm uppercase tracking-wider hover:bg-kitsune-lime transition-all hover:scale-105"
            >
              View All Upcoming →
            </Link>
          </motion.section>
        )}
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-kitsune-pink hover:bg-kitsune-lime text-black rounded-full transition-all hover:scale-110 z-40"
      >
        <BiChevronUpCircle size={24} />
      </motion.button>
    </div>
  )
}

export default Home
