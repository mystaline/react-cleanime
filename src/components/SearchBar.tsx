import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BiSearch } from 'react-icons/bi'

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`)
      setQuery('')
    }
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          className="w-full px-6 py-3 bg-kitsune-gray border-2 border-kitsune-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-kitsune-pink transition-colors group-hover:border-kitsune-pink"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-kitsune-pink hover:text-kitsune-lime transition-colors"
        >
          <BiSearch size={20} />
        </motion.button>
      </div>
    </motion.form>
  )
}

export default SearchBar
