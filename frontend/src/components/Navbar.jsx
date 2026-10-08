import React from 'react';
import { BookOpen, Upload, Moon, Sun, Info, Compass, Sparkles } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  darkMode, 
  setDarkMode, 
  onOpenUploadModal, 
  onOpenGuidelines 
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-[#5798D7]/25 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5798D7] flex items-center justify-center text-black shadow-sm group-hover:scale-105 transition-transform border border-[#3b79b5]/40">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-black dark:text-white tracking-tight">
                PYQVault
              </span>
              <span className="block text-[10px] font-bold text-black/70 dark:text-slate-400 tracking-wider uppercase">
                Local Paper Sharing
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'home'
                  ? 'bg-white dark:bg-[#1A2C46] text-black dark:text-white shadow-xs border border-[#5798D7]/40'
                  : 'text-black/80 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1A2C46]/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentTab('browse')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'browse' || currentTab === 'paper-detail'
                  ? 'bg-white dark:bg-[#1A2C46] text-black dark:text-white shadow-xs border border-[#5798D7]/40'
                  : 'text-black/80 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1A2C46]/60'
              }`}
            >
              <Compass className="w-4 h-4 text-black dark:text-white" />
              <span>Browse Papers</span>
            </button>

            <button
              onClick={onOpenGuidelines}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-black/80 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1A2C46]/60 transition-colors cursor-pointer"
              title="View Upload Guidelines"
            >
              <Info className="w-4 h-4 text-black dark:text-white" />
              <span>Guidelines</span>
            </button>
          </nav>

          {/* Actions: Theme Toggle & Upload Button */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl text-black dark:text-yellow-400 hover:bg-white dark:hover:bg-[#1A2C46] transition-all border border-[#5798D7]/30 bg-white/70 dark:bg-[#132238] shadow-xs cursor-pointer"
              aria-label="Toggle Theme"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-black" />
              )}
            </button>

            {/* Prominent Upload Button with Pistachio #B9C255 */}
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-extrabold text-black bg-[#B9C255] hover:bg-[#A7B142] active:scale-95 shadow-sm border border-[#8F9836]/40 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-black" />
              <span>Upload Paper</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
