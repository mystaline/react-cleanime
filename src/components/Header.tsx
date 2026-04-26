import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BiMenu, BiX, BiHide, BiShow } from 'react-icons/bi'
import { useState } from 'react'
import { useNSFW } from '../features/NSFWContext'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { allowNSFW, setAllowNSFW } = useNSFW()

  return (
    <header className="bg-kitsune-black border-b border-kitsune-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <NavLink to="/" className="group flex items-center gap-2">
              <span className="text-4xl font-bold font-display">
                <span className="text-kitsune-pink group-hover:text-kitsune-lime transition-colors">C</span>
                <span className="text-white">LEANIME</span>
              </span>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/top', label: 'Top' },
              { path: '/current', label: 'Current' },
              { path: '/upcoming', label: 'Upcoming' },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-bold text-sm uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-kitsune-pink text-black'
                      : 'text-white hover:text-kitsune-pink border border-transparent hover:border-kitsune-pink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* NSFW Toggle & Mobile menu button */}
          <div className="flex gap-2 items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAllowNSFW(!allowNSFW)}
              title={allowNSFW ? 'Hide NSFW content' : 'Show NSFW content'}
              className={`p-2 rounded transition-colors ${
                allowNSFW
                  ? 'bg-kitsune-pink text-black hover:bg-kitsune-lime'
                  : 'text-kitsune-pink hover:text-kitsune-lime border border-kitsune-pink hover:border-kitsune-lime'
              }`}
            >
              {allowNSFW ? <BiShow size={20} /> : <BiHide size={20} />}
            </motion.button>

            <button
              className="md:hidden text-kitsune-pink hover:text-kitsune-lime transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {[
              { path: '/', label: 'Home' },
              { path: '/top', label: 'Top' },
              { path: '/current', label: 'Current' },
              { path: '/upcoming', label: 'Upcoming' },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 font-bold text-sm uppercase transition-colors ${
                    isActive
                      ? 'bg-kitsune-pink text-black'
                      : 'text-white hover:text-kitsune-pink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  )
}

export default Header
