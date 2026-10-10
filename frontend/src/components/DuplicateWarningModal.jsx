import React from "react";
import {
  AlertTriangle,
  ExternalLink,
  X,
  ArrowRight,
  Upload,
} from "lucide-react";

export default function DuplicateWarningModal({
  isOpen,
  existingPaper,
  onViewExisting,
  onCancel,
  onProceedAnyway,
}) {
  if (!isOpen || !existingPaper) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="window-card bg-white dark:bg-[#132238] rounded-2xl max-w-md w-full shadow-2xl border border-[#5798D7]/30 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Header */}
        <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-black text-black dark:text-white pl-2">
              Duplicate Notice
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-black/70 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#5798D7]/20 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Top Warning Badge */}
          <div className="flex items-center space-x-3 text-black dark:text-white mb-4">
            <div className="p-2.5 bg-[#E6F1FA] dark:bg-[#1A2C46] rounded-xl border border-[#5798D7]/30">
              <AlertTriangle className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-black dark:text-white tracking-tight">
                Duplicate Paper Warning
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black/70 dark:text-slate-400">
                Matching Metadata Found
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="p-3.5 bg-[#F4F8FC] dark:bg-[#0E1828] rounded-xl border border-[#5798D7]/25 text-black dark:text-white text-sm space-y-2">
            <p className="font-bold text-black dark:text-white text-xs">
              A question paper already exists for:
            </p>
            <div className="bg-white dark:bg-[#1A2C46] p-2.5 rounded-lg border border-[#5798D7]/30 font-mono text-xs text-black dark:text-white font-extrabold">
              {existingPaper.course} — {existingPaper.year} —{" "}
              {existingPaper.exam_type}
            </div>
            <p className="text-xs text-black/70 dark:text-slate-400 font-medium">
              Uploaded on{" "}
              {new Date(existingPaper.upload_date).toLocaleDateString()} (
              {existingPaper.page_count} page
              {existingPaper.page_count !== 1 ? "s" : ""}).
            </p>
          </div>

          <p className="text-xs text-black/70 dark:text-slate-300 my-4 leading-relaxed font-medium">
            You can view the existing paper to check if it matches yours, cancel
            this upload, or proceed to upload an additional set anyway.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => onViewExisting(existingPaper.id)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#5798D7] hover:bg-[#4486C5] text-black text-xs font-extrabold rounded-xl transition-all shadow-xs border border-[#3b79b5]/40 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-black" />
              <span>View Existing Paper</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-[#E6F1FA] dark:bg-[#1A2C46] hover:bg-[#D4E6F5] dark:hover:bg-[#233B5C] text-black dark:text-white text-xs font-bold rounded-xl border border-[#5798D7]/30 transition-colors cursor-pointer"
              >
                Cancel Upload
              </button>

              <button
                onClick={onProceedAnyway}
                className="px-4 py-2 bg-[#B9C255] hover:bg-[#A7B142] text-black text-xs font-extrabold rounded-xl border border-[#8F9836]/40 transition-all shadow-xs cursor-pointer"
              >
                Upload Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
