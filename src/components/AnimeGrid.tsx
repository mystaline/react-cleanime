import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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

interface AnimeGridProps {
  animes: Anime[]
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animes }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
    >
      {animes.map((anime) => (
        <motion.div key={anime.mal_id} variants={itemVariants}>
          <Link to={`/anime/${anime.mal_id}`}>
            <div className="group relative overflow-hidden rounded-lg bg-kitsune-gray border border-kitsune-border hover:border-kitsune-pink transition-all hover:shadow-lg hover:shadow-kitsune-pink/50">
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[3/4] bg-kitsune-border">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-3">
                  <div className="space-y-2">
                    <p className="text-kitsune-lime font-bold text-sm line-clamp-2">
                      {anime.title}
                    </p>
                    {anime.score && (
                      <div className="flex items-center gap-1">
                        <span className="text-kitsune-pink text-xs font-bold">★</span>
                        <span className="text-white text-xs">{anime.score.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <button className="w-full py-2 bg-kitsune-pink text-black font-bold text-xs uppercase rounded hover:bg-kitsune-lime transition-colors">
                    View
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="p-3 min-h-16 flex items-center">
                <p className="text-white text-xs font-semibold line-clamp-3 group-hover:text-kitsune-pink transition-colors">
                  {anime.title}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default AnimeGrid
