import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  Download,
  Plus,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle2,
  FileImage,
  ZoomIn,
  X,
  Trash2,
} from "lucide-react";
import {
  fetchPaperById,
  fetchSolutionsApi,
  getPaperDownloadUrl,
  getSolutionDownloadUrl,
} from "../services/api";
import UploadSolutionModal from "../components/UploadSolutionModal";

export default function PaperDetailPage({
  paperId,
  onBack,
  onViewPaperViewer,
  onDeletePaper,
}) {
  const [paper, setPaper] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const paperData = await fetchPaperById(paperId);
      setPaper(paperData);

      const solData = await fetchSolutionsApi(paperId);
      setSolutions(solData.solutions || []);
    } catch (err) {
      setError(err.message || "Failed to load paper details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paperId) loadData();
  }, [paperId]);

  const handleSolutionUploaded = (newSolution) => {
    setSolutions((prev) => [...prev, newSolution]);
    // Refresh paper details to update counts
    loadData();
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto" />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-red-500 font-semibold">
          {error || "Paper not found."}
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[#E6F1FA] hover:bg-[#D4E6F5] text-black border border-[#5798D7]/30 font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-extrabold text-black dark:text-white hover:text-[#5798D7] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
        <span>Back to Browse</span>
      </button>

      {/* Main Paper Header Card - Window Mockup style */}
      <div className="window-card rounded-3xl border border-[#5798D7]/25 shadow-sm overflow-hidden">
        {/* Window Top Bar */}
        <div className="window-header">
          <span className="text-[11px] font-bold text-black px-2.5 py-0.5 rounded-full bg-[#B9C255] border border-[#8F9836]/40">
            {paper.exam_type}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#B9C255] text-black rounded-full text-xs font-extrabold">
                  {paper.exam_type}
                </span>
                <span className="px-3 py-1 bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white rounded-full text-xs font-bold font-mono border border-[#5798D7]/30 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span>{paper.year}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
                {paper.course}
              </h1>

              <div className="flex items-center space-x-4 text-xs font-semibold text-black/70 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <FileText className="w-4 h-4 text-black/60 dark:text-slate-400" />
                  <span>
                    {paper.pages ? paper.pages.length : paper.page_count}{" "}
                    page(s)
                  </span>
                </span>
                <span>•</span>
                <span>
                  Uploaded on {new Date(paper.upload_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onViewPaperViewer(paper)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#5798D7] hover:bg-[#4486C5] text-black font-extrabold text-sm rounded-2xl shadow-xs border border-[#3b79b5]/40 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-black" />
                <span>View Paper</span>
              </button>

              <a
                href={getPaperDownloadUrl(paper.id)}
                download
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#B9C255] hover:bg-[#A7B142] text-black font-extrabold text-sm rounded-2xl shadow-xs border border-[#8F9836]/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download Paper</span>
              </a>

              {onDeletePaper && (
                <button
                  onClick={() => onDeletePaper(paper)}
                  className="flex items-center justify-center space-x-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-sm rounded-2xl border border-red-200 transition-all cursor-pointer"
                  title="Delete this Question Paper"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Paper</span>
                </button>
              )}
            </div>
          </div>

          {/* Paper Thumbnail / Page Preview Grid */}
          {paper.pages && paper.pages.length > 0 && (
            <div className="pt-6 border-t border-[#5798D7]/20">
              <p className="text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-300 mb-3">
                Question Paper Preview ({paper.pages.length} Pages)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {paper.pages.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    onClick={() => onViewPaperViewer(paper)}
                    className="group relative bg-[#F4F8FC] dark:bg-[#0E1828] rounded-2xl overflow-hidden border border-[#5798D7]/25 aspect-[3/4] cursor-pointer hover:ring-2 hover:ring-[#5798D7] shadow-xs transition-all"
                  >
                    <img
                      src={`/${p.file_path}`}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-[#5798D7]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="p-2.5 bg-white dark:bg-[#132238] text-black dark:text-white rounded-full shadow-md border border-[#5798D7]/30">
                        <Eye className="w-4 h-4 text-black dark:text-white" />
                      </span>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white border border-[#5798D7]/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Page {p.page_number || idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Solutions Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5798D7]/20 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-black dark:text-white" />
              <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
                Solutions Section
              </h2>
            </div>
            <p className="text-sm font-semibold text-black/70 dark:text-slate-400 mt-1">
              Contributed solutions for {paper.course} ({paper.year}{" "}
              {paper.exam_type})
            </p>
          </div>

          <button
            onClick={() => setIsSolutionModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#B9C255] hover:bg-[#A7B142] text-black font-extrabold text-sm shadow-xs border border-[#8F9836]/40 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Solution</span>
          </button>
        </div>

        {/* List of Solutions */}
        {solutions && solutions.length > 0 ? (
          <div className="space-y-6">
            {solutions.map((sol, index) => (
              <div
                key={sol.id}
                className="window-card bg-white dark:bg-[#132238] rounded-2xl border border-[#5798D7]/25 shadow-xs overflow-hidden"
              >
                {/* Solution Window Header */}
                <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-4 py-2.5 flex items-center justify-between gap-4">
                  {/* Left: Solution label */}
                  <div className="px-2.5 py-0.5 rounded-full bg-[#B9C255] text-black font-extrabold text-[11px] uppercase tracking-wide shrink-0">
                    {sol.solution_label || `Solution ${index + 1}`}
                  </div>

                  {/* Right: Upload date + Download */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-black/80 dark:text-slate-300">
                      Uploaded on{" "}
                      {new Date(sol.upload_date).toLocaleDateString()}
                    </span>

                    <a
                      href={getSolutionDownloadUrl(sol.id)}
                      download
                      className="flex items-center space-x-1.5 px-3 py-1 bg-white dark:bg-[#132238] hover:bg-[#D4E6F5] dark:hover:bg-[#1A2C46] text-black dark:text-white rounded-xl text-xs font-bold border border-[#5798D7]/30 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-black dark:text-white" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>

                {/* Solution Pages Display */}
                <div className="p-6 space-y-4">
                  <p className="text-xs font-bold text-black dark:text-white">
                    Solution Pages ({sol.pages ? sol.pages.length : 0} Page
                    {sol.pages && sol.pages.length !== 1 ? "s" : ""}):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sol.pages &&
                      sol.pages.map((sp, pIdx) => (
                        <div
                          key={sp.id || pIdx}
                          onClick={() =>
                            setPreviewImageModal(`/${sp.file_path}`)
                          }
                          className="group relative bg-[#F4F8FC] dark:bg-[#0E1828] rounded-2xl overflow-hidden border border-[#5798D7]/25 cursor-pointer shadow-xs hover:ring-2 hover:ring-[#5798D7] transition-all"
                        >
                          <img
                            src={`/${sp.file_path}`}
                            alt={`Solution ${index + 1} Page ${pIdx + 1}`}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-[#5798D7]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="p-2.5 bg-white dark:bg-[#132238] text-black dark:text-white rounded-full shadow-md border border-[#5798D7]/30">
                              <ZoomIn className="w-5 h-5 text-black dark:text-white" />
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white border border-[#5798D7]/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
                            Page {sp.page_number || pIdx + 1}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="window-card bg-white dark:bg-[#132238] rounded-2xl border border-[#5798D7]/25 shadow-xs overflow-hidden">
            <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-4 py-2 flex items-center"></div>
            <div className="p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white mx-auto flex items-center justify-center border border-[#5798D7]/30">
                <MessageSquare className="w-6 h-6 text-black dark:text-white" />
              </div>
              <h3 className="text-base font-black text-black dark:text-white">
                No solutions uploaded for this paper yet
              </h3>
              <p className="text-xs font-semibold text-black/80 dark:text-slate-400 max-w-sm mx-auto">
                Have you solved this question paper? Be the first to share your
                solution with fellow students!
              </p>
              <button
                onClick={() => setIsSolutionModalOpen(true)}
                className="px-6 py-2.5 bg-[#B9C255] hover:bg-[#A7B142] text-black font-extrabold text-xs rounded-xl shadow-xs border border-[#8F9836]/40 transition-all cursor-pointer"
              >
                Contribute Solution
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Solution Modal */}
      <UploadSolutionModal
        isOpen={isSolutionModalOpen}
        paper={paper}
        onClose={() => setIsSolutionModalOpen(false)}
        onSuccessUpload={handleSolutionUploaded}
      />

      {/* Lightbox / Zoom Image Modal */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="window-card bg-white dark:bg-[#132238] rounded-2xl max-w-4xl max-h-[90vh] w-full flex flex-col overflow-hidden border border-[#5798D7]/30 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-black text-black dark:text-white pl-2">
                  Image Preview
                </span>
              </div>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="p-1 rounded-lg text-black dark:text-white hover:bg-[#5798D7]/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-black dark:text-white" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center overflow-auto bg-[#F4F8FC] dark:bg-[#0E1828]">
              <img
                src={previewImageModal}
                alt="Solution Image Zoom"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-md border border-[#5798D7]/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
