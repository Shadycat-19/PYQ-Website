import React from "react";
import { X, CheckCircle2, FileImage } from "lucide-react";

export default function ImageGuidelinesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const guidelines = [
    {
      title: "Clear & Readable",
      desc: "Ensure all questions, diagrams, and text are crisp and legible.",
    },
    {
      title: "Full Page Visibility",
      desc: "Make sure all edges and text corners of the question paper are visible.",
    },
    {
      title: "Good Lighting & Angles",
      desc: "Avoid dark shadows, extreme angles, or blurry photos.",
    },
    {
      title: "One Image per Page",
      desc: "If the paper has multiple pages, upload page images in correct page order.",
    },
    {
      title: "Supported Formats",
      desc: "JPG, JPEG, PNG, and WebP (up to 15MB per image file).",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="window-card bg-white dark:bg-[#132238] rounded-2xl max-w-lg w-full shadow-2xl border border-[#5798D7]/30 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Window Top Bar */}
        <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 pl-2">
              <FileImage className="w-4 h-4 text-black dark:text-white" />
              <h3 className="text-sm font-black text-black dark:text-white">
                Image Upload Guidelines
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-black/70 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#5798D7]/15 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-black/80 dark:text-slate-400 font-medium mb-4">
            Follow these tips to ensure high quality for all students
          </p>

          {/* Guidelines List */}
          <div className="space-y-3">
            {guidelines.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-[#E6F1FA]/60 dark:bg-[#1A2C46]/60 border border-[#5798D7]/20"
              >
                <div className="w-5 h-5 rounded-full bg-[#B9C255] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-black/80 dark:text-slate-300 mt-0.5 font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-5 mt-5 border-t border-[#5798D7]/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#B9C255] hover:bg-[#aab345] text-black font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
