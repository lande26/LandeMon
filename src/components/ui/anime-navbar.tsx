"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
  leftNode?: React.ReactNode
  rightNode?: React.ReactNode
  mobileMenuNode?: React.ReactNode
}

export function AnimeNavBar({ items, className, defaultActive = "Home", leftNode, rightNode, mobileMenuNode }: NavBarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(defaultActive)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Find active tab from pathname
    const currentItem = items.find(item => item.url === pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) return null

  return (
    <div className={cn("fixed top-5 left-0 right-0 z-[9999] pointer-events-none", className)}>
      <div className="flex justify-center px-4">
        <motion.div 
          className="flex items-center justify-between w-full max-w-6xl gap-2 bg-secondary/80 border border-border backdrop-blur-md py-2 px-4 sm:px-6 rounded-full shadow-2xl relative pointer-events-auto"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {/* Left Node (Logo) */}
          {leftNode && (
            <div className="flex-shrink-0 flex items-center mr-4 hidden md:flex">
              {leftNode}
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuNode && (
            <div className="flex-shrink-0 flex items-center md:hidden">
              {mobileMenuNode}
            </div>
          )}

          {/* Center Tabs */}
          <div className="hidden md:flex items-center gap-1 sm:gap-3 flex-1 justify-center">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => {
                  setActiveTab(item.name)
                }}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300",
                  "text-muted-foreground hover:text-foreground",
                  isActive && "text-foreground drop-shadow-sm"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/25 rounded-full blur-md" />
                    <div className="absolute inset-[-4px] bg-primary/20 rounded-full blur-xl" />
                    <div className="absolute inset-[-8px] bg-primary/15 rounded-full blur-2xl" />
                    <div className="absolute inset-[-12px] bg-primary/5 rounded-full blur-3xl" />
                    
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                      style={{
                        animation: "shine 3s ease-in-out infinite"
                      }}
                    />
                  </motion.div>
                )}

                <motion.span
                  className="hidden md:inline relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
                <motion.span 
                  className="md:hidden flex items-center justify-center relative z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </motion.span>
          
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-foreground/10 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                {isActive && !isMobile && (
                  <motion.div
                    layoutId="anime-neko"
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none md:block hidden"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="relative w-10 h-8 flex justify-center items-end overflow-hidden">
                      <motion.div
                        className="w-8 h-6 bg-foreground rounded-t-lg relative"
                        animate={
                          hoveredTab ? {
                            y: [0, -2, 0],
                            transition: {
                              duration: 0.5,
                              ease: "easeInOut"
                            }
                          } : {
                            y: [0, -1, 0],
                            transition: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }
                        }
                      >
                        {/* Ears */}
                        <div className="absolute -top-2 left-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-foreground transform -rotate-12" />
                        <div className="absolute -top-2 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-foreground transform rotate-12" />
                        
                        {/* Inner Ears (Pink) */}
                        <div className="absolute -top-1 left-[2px] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-pink-300 transform -rotate-12 z-10" />
                        <div className="absolute -top-1 right-[2px] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-pink-300 transform rotate-12 z-10" />

                        {/* Eyes */}
                        <motion.div 
                          className="absolute w-1.5 h-1.5 bg-background rounded-full top-2 left-1.5"
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.1, 1],
                              transition: { duration: 0.15, times: [0, 0.5, 1] }
                            } : {}
                          }
                        />
                        <motion.div 
                          className="absolute w-1.5 h-1.5 bg-background rounded-full top-2 right-1.5"
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.1, 1],
                              transition: { duration: 0.15, times: [0, 0.5, 1] }
                            } : {}
                          }
                        />

                        {/* Blushes */}
                        <div className="absolute top-3 left-0.5 w-1.5 h-1 bg-pink-300 rounded-full opacity-60" />
                        <div className="absolute top-3 right-0.5 w-1.5 h-1 bg-pink-300 rounded-full opacity-60" />

                        {/* Mouth (Little w) */}
                        <svg className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-1.5 text-background" viewBox="0 0 10 5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1,2 Q2.5,5 5,2 Q7.5,5 9,2" />
                        </svg>

                        {/* Little paws peering over */}
                        <div className="absolute -top-1 left-1.5 w-2 h-1.5 bg-foreground rounded-t-full shadow-sm" />
                        <div className="absolute -top-1 right-1.5 w-2 h-1.5 bg-foreground rounded-t-full shadow-sm" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
          </div>

          {/* Right Node (Search, Theme, Auth) */}
          {rightNode && (
            <div className="flex-shrink-0 flex items-center ml-4">
              {rightNode}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 
