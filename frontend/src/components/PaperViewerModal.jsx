import React, { useState } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
} from "lucide-react";
import { getPaperDownloadUrl } from "../services/api";

export default function PaperViewerModal({ paper, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!paper) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#000000]/60 backdrop-blur-sm animate-fade-in">
      {/* Top Header Controls Bar (macOS Window Header style) */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/30 shadow-sm transition-colors">
        {/* Left: Traffic Dots & Metadata */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 pl-2">
            <div className="p-1.5 bg-[#5798D7]/20 text-black dark:text-white rounded-lg">
              <FileText className="w-4 h-4 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-black dark:text-white line-clamp-1">
                {paper.course}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-black/80 dark:text-slate-300 font-mono">
                <span className="font-semibold">{paper.year}</span>
                <span>•</span>
                <span className="uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#B9C255] text-black font-bold text-[10px]">
                  {paper.exam_type}
                </span>
                <span>•</span>
                <span>
                  {paper.pages ? paper.pages.length : paper.page_count} Page(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Zoom Controls & Download */}
        <div className="flex items-center space-x-3">
          {/* <div className="flex items-center bg-white dark:bg-[#0E1828] rounded-xl p-1 border border-[#5798D7]/30 shadow-xs">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-1.5 rounded-lg text-black dark:text-white hover:bg-[#5798D7]/20 disabled:opacity-30 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-black dark:text-white" />
            </button>

            <span className="px-3 text-xs font-mono font-bold text-black dark:text-white">
              {zoomLevel}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1.5 rounded-lg text-black dark:text-white hover:bg-[#5798D7]/20 disabled:opacity-30 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-black dark:text-white" />
            </button>

            {zoomLevel !== 100 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 ml-1 border-l border-[#5798D7]/20 text-black/70 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5 text-black dark:text-white" />
              </button>
            )}
          </div> */}

          <a
            href={getPaperDownloadUrl(paper.id)}
            download
            className="flex items-center space-x-2 px-4 py-2 bg-[#B9C255] hover:bg-[#aab345] text-black rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">Download Paper</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-black/70 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#5798D7]/20 transition-colors cursor-pointer"
            title="Close Viewer"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>
      </div>

      {/* Pages Scroll Area - Vertical Display */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center space-y-8 bg-[#F4F8FC] dark:bg-[#0B1320]">
        {paper.pages && paper.pages.length > 0 ? (
          paper.pages.map((page, idx) => (
            <div
              key={page.id || idx}
              className="window-card bg-white dark:bg-[#132238] rounded-2xl border border-[#5798D7]/30 shadow-xl overflow-hidden max-w-5xl w-full transition-all duration-200"
              style={{ width: `${zoomLevel}%` }}
            >
              <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-4 py-2 flex justify-between items-center text-xs font-bold text-black dark:text-white font-mono">
                <div className="flex items-center space-x-2">
                  <span className="pl-2">
                    Page {page.page_number || idx + 1} of {paper.pages.length}
                  </span>
                </div>
                <span className="text-black/70 dark:text-slate-400">
                  {paper.course}
                </span>
              </div>
              <div className="w-full bg-white dark:bg-[#0E1828] p-2">
                <img
                  src={`/${page.file_path}`}
                  alt={`Question Paper Page ${page.page_number || idx + 1}`}
                  className="w-full h-auto object-contain block mx-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-black dark:text-white">
            <p className="font-semibold text-black dark:text-white">
              No image pages found for this question paper.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
