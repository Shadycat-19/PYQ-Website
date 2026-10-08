import React from 'react';
import { Compass, Upload, BookOpen, ArrowRight } from 'lucide-react';
import PaperCard from '../components/PaperCard';

export default function HomePage({ 
  recentPapers, 
  onNavigateBrowse, 
  onOpenUpload, 
  onViewPaper, 
  onDownloadPaper, 
  onViewSolutions,
  onDeletePaper 
}) {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Clean Minimalist Hero matching Image 1 showcase style */}
      <section className="relative overflow-hidden py-14 px-6 sm:px-10 rounded-3xl bg-white dark:bg-[#132238] border border-[#5798D7]/25 shadow-sm text-center transition-colors">
        
        {/* Soft Frost accent backdrop glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#E6F1FA] dark:bg-[#5798D7]/15 rounded-full blur-3xl pointer-events-none opacity-80 dark:opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#F4F6E6] dark:bg-[#B9C255]/10 rounded-full blur-3xl pointer-events-none opacity-80 dark:opacity-30" />

        <div className="relative max-w-4xl mx-auto space-y-8">
          
          {/* Big Bold Clean Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-black dark:text-white tracking-tight leading-[1.15]">
            Find, share, and contribute <br />
            <span>previous-year question papers</span>
          </h1>

          {/* Action CTAs in Iced Denim and Pistachio with crisp black text */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateBrowse}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-2xl bg-[#5798D7] hover:bg-[#4486C5] text-black font-extrabold text-base shadow-sm border border-[#3b79b5]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-black" />
              <span>Browse Papers</span>
              <ArrowRight className="w-4 h-4 text-black ml-1" />
            </button>

            <button
              onClick={onOpenUpload}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-2xl bg-[#B9C255] hover:bg-[#A7B142] text-black font-extrabold text-base shadow-sm border border-[#8F9836]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-5 h-5 text-black" />
              <span>Upload Paper</span>
            </button>
          </div>

        </div>
      </section>

      {/* Recent Uploads Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
              Recently Uploaded Papers
            </h2>
            <p className="text-sm font-semibold text-black/70 dark:text-slate-400 mt-1">
              Latest contributions added to the local repository
            </p>
          </div>

          <button
            onClick={onNavigateBrowse}
            className="flex items-center space-x-1.5 text-sm font-extrabold text-black dark:text-white hover:text-[#5798D7] transition-colors cursor-pointer"
          >
            <span>View All Papers</span>
            <ArrowRight className="w-4 h-4 text-black dark:text-white" />
          </button>
        </div>

        {recentPapers && recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPapers.slice(0, 6).map(paper => (
              <PaperCard
                key={paper.id}
                paper={paper}
                onView={onViewPaper}
                onDownload={onDownloadPaper}
                onViewSolutions={onViewSolutions}
                onDelete={onDeletePaper}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#132238] rounded-3xl border border-[#5798D7]/25 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white mx-auto flex items-center justify-center border border-[#5798D7]/30">
              <BookOpen className="w-7 h-7 text-black dark:text-white" />
            </div>
            <h3 className="text-lg font-black text-black dark:text-white">
              No papers uploaded yet
            </h3>
            <p className="text-sm font-medium text-black/70 dark:text-slate-400 max-w-sm mx-auto">
              Be the first to share a question paper to get the repository started!
            </p>
            <button
              onClick={onOpenUpload}
              className="px-6 py-2.5 bg-[#B9C255] hover:bg-[#A7B142] text-black font-extrabold text-sm rounded-xl shadow-xs border border-[#8F9836]/40 transition-all cursor-pointer"
            >
              Upload First Paper
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
