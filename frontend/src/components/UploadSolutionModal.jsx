import React, { useState } from 'react';
import { X, Upload, FileImage, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { uploadSolutionApi } from '../services/api';

export default function UploadSolutionModal({ isOpen, paper, onClose, onSuccessUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !paper) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const validPreviews = [];
    let hasError = false;

    files.forEach((file) => {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WebP image files are supported.');
        hasError = true;
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds maximum size limit of 15MB.`);
        hasError = true;
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    if (!hasError) setError(null);

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...validPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedFiles.length === 0) {
      setError('Please upload at least one solution image.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const res = await uploadSolutionApi(paper.id, formData);
      setLoading(false);

      setSelectedFiles([]);
      setPreviews([]);

      if (onSuccessUpload) onSuccessUpload(res.solution);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to upload solution.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div 
        className="window-card bg-white dark:bg-[#132238] rounded-2xl max-w-xl w-full shadow-2xl border border-[#5798D7]/30 relative max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Header */}
        <div className="window-header bg-[#E6F1FA] dark:bg-[#1A2C46] border-b border-[#5798D7]/20 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="traffic-dots">
              <span className="traffic-dot bg-[#ff5f56]" />
              <span className="traffic-dot bg-[#ffbd2e]" />
              <span className="traffic-dot bg-[#27c93f]" />
            </div>
            <div className="pl-2">
              <h2 className="text-sm font-black text-black dark:text-white tracking-tight line-clamp-1">
                Add Solution for {paper.course}
              </h2>
              <p className="text-[10px] text-black/70 dark:text-slate-400 font-mono font-semibold">
                {paper.year} • {paper.exam_type}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-black/70 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#5798D7]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start space-x-3 text-red-700 dark:text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Guidelines box */}
          <div className="p-3.5 bg-[#E6F1FA]/80 dark:bg-[#1A2C46]/80 rounded-2xl border border-[#5798D7]/30 text-xs text-black dark:text-white space-y-1">
            <p className="font-extrabold text-black dark:text-white">Solution Guidelines:</p>
            <ul className="list-disc list-inside space-y-0.5 text-black/80 dark:text-slate-300 font-medium">
              <li>Upload clean, legible step-by-step answers or solved diagrams.</li>
              <li>Order images page-by-page if solution spans multiple pages.</li>
            </ul>
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">
              Solution Image(s) <span className="text-red-500">*</span>
            </label>
            
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#5798D7]/40 hover:border-[#5798D7] rounded-2xl bg-[#E6F1FA]/40 dark:bg-[#0E1828]/60 hover:bg-[#E6F1FA] dark:hover:bg-[#16253C]/80 cursor-pointer transition-colors group">
              <FileImage className="w-10 h-10 text-black/60 dark:text-slate-400 group-hover:text-[#5798D7] transition-colors mb-2" />
              <p className="text-sm font-bold text-black dark:text-white">
                Click or drag solution page images
              </p>
              <p className="text-xs text-black/60 dark:text-slate-400 mt-1 font-medium">
                Supported formats: JPG, PNG, WebP (max 15MB each)
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-black dark:text-slate-200 mb-2">
                Solution Pages ({previews.length} page{previews.length !== 1 ? 's' : ''})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((src, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-[#5798D7]/30 bg-white dark:bg-[#0E1828] aspect-[3/4] shadow-xs">
                    <img src={src} alt={`Solution Page ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white border border-[#5798D7]/30 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                      Sol P{index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-400 hover:bg-red-500 text-black rounded-lg opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                      title="Remove page"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-[#5798D7]/20 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#5798D7]/30 text-black dark:text-white text-sm font-bold bg-[#E6F1FA] dark:bg-[#1A2C46] hover:bg-[#D4E6F5] dark:hover:bg-[#233B5C] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#B9C255] hover:bg-[#A7B142] text-black text-sm font-extrabold shadow-xs border border-[#8F9836]/40 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-black" />
                  <span>Submit Solution</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
