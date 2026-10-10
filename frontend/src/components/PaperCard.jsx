import React from "react";
import {
  Eye,
  Download,
  MessageSquare,
  Calendar,
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react";

export default function PaperCard({
  paper,
  onView,
  onDownload,
  onViewSolutions,
  onDelete,
}) {
  const formattedDate = new Date(paper.upload_date).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <div className="window-card flex flex-col justify-between group">
      <div>
        {/* Browser Window Header like Image 1 */}
        <div className="window-header">
          <div className="flex justify-between w-full space-x-2">
            <span className="text-[11px] font-bold text-black px-2 py-0.5 rounded-full bg-[#B9C255] border border-[#8F9836]/40">
              {paper.exam_type}
            </span>

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(paper);
                }}
                className="p-1 text-black/60 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                title="Delete Paper"
                aria-label="Delete Paper"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Year & Pages Row */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center space-x-1.5 bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white font-bold px-2.5 py-1 rounded-lg border border-[#5798D7]/30">
              <Calendar className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>{paper.year}</span>
            </div>

            <div className="flex items-center space-x-1 text-black/75 dark:text-slate-300 font-semibold">
              <FileText className="w-3.5 h-3.5 text-black/60 dark:text-slate-400" />
              <span>
                {paper.page_count} page{paper.page_count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Title / Course */}
          <h3
            onClick={() => onView(paper.id)}
            className="text-lg font-black text-black dark:text-white group-hover:text-[#5798D7] transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {paper.course}
          </h3>

          <p className="text-[11px] font-medium text-black/60 dark:text-slate-400 mb-2">
            Uploaded on {formattedDate}
          </p>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-0 space-y-2">
        {/* Primary Action Row: View & Download */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onView(paper.id)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#5798D7] hover:bg-[#4486C5] text-black font-extrabold rounded-xl text-xs shadow-xs border border-[#3b79b5]/40 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-black" />
            <span>View Paper</span>
          </button>

          <button
            onClick={() => onDownload(paper.id)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#E6F1FA] dark:bg-[#1A2C46] hover:bg-[#D4E6F5] dark:hover:bg-[#223959] text-black dark:text-white font-extrabold rounded-xl text-xs border border-[#5798D7]/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Download</span>
          </button>
        </div>

        {/* Dedicated Solutions Button */}
        <button
          onClick={() => onViewSolutions(paper.id)}
          className="w-full flex items-center justify-between py-2 px-3 bg-[#F4F8FC] dark:bg-[#0E1828] hover:bg-[#E6F1FA] dark:hover:bg-[#1A2C46] text-black dark:text-white font-bold rounded-xl text-xs border border-[#5798D7]/25 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Solutions Section</span>
          </div>

          <span
            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
              paper.solutions_count > 0
                ? "bg-[#B9C255] text-black border-[#8F9836]/40"
                : "bg-white dark:bg-[#1A2C46] text-black/70 dark:text-slate-300 border-[#5798D7]/20"
            }`}
          >
            {paper.solutions_count > 0
              ? `${paper.solutions_count} solution${paper.solutions_count !== 1 ? "s" : ""}`
              : "No solutions"}
          </span>
        </button>
      </div>
    </div>
  );
}
