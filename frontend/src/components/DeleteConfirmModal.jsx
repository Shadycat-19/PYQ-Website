import React from "react";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  paper,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !paper) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="window-card bg-white dark:bg-[#132238] rounded-2xl max-w-md w-full shadow-2xl border border-red-300 dark:border-red-900/50 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Header */}
        <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-black text-black dark:text-white pl-2">
              System Notice
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-black/70 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#5798D7]/20 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Warning Icon & Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-red-100 dark:bg-red-950/60 rounded-xl border border-red-300 dark:border-red-900/60">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-black dark:text-white tracking-tight">
                Delete Question Paper
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black/70 dark:text-slate-400">
                Permanent Action
              </span>
            </div>
          </div>

          {/* Paper details box */}
          <div className="p-3.5 bg-[#E6F1FA]/60 dark:bg-[#1A2C46]/60 rounded-xl border border-[#5798D7]/30 text-black dark:text-white text-sm space-y-2">
            <p className="text-xs text-black/80 dark:text-slate-300 font-semibold">
              Are you sure you want to delete this question paper?
            </p>
            <div className="bg-white dark:bg-[#0E1828] p-2.5 rounded-lg border border-[#5798D7]/20 font-black text-xs text-black dark:text-white">
              {paper.course} — {paper.year} ({paper.exam_type})
            </div>
            <p className="text-xs text-black/80 dark:text-slate-300 flex items-center space-x-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span>
                All uploaded image pages and community solutions will also be
                permanently deleted.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 bg-[#E6F1FA] dark:bg-[#1A2C46] hover:bg-[#D4E6F5] dark:hover:bg-[#233B5C] text-black dark:text-white text-xs font-bold rounded-xl border border-[#5798D7]/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onConfirm(paper.id)}
              disabled={isDeleting}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-400 hover:bg-red-500 active:scale-95 text-black text-xs font-black rounded-xl border border-red-500 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span className="text-black">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 text-black" />
                  <span className="text-black">Delete Paper</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
