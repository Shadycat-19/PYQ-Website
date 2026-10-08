import React, { useState, useEffect } from 'react';
import { X, Upload, FileImage, Plus, Trash2, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { checkDuplicatePaper, uploadPaperApi, fetchMetaOptionsApi } from '../services/api';
import DuplicateWarningModal from './DuplicateWarningModal';

export default function UploadPaperModal({ isOpen, onClose, onSuccessUpload, onViewPaper }) {
  const [course, setCourse] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [examType, setExamType] = useState('Endsem');
  const [customExamType, setCustomExamType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [existingCourses, setExistingCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Duplicate Check State
  const [duplicateWarningData, setDuplicateWarningData] = useState(null);
  const [bypassDuplicateCheck, setBypassDuplicateCheck] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch dynamic course suggestions
      fetchMetaOptionsApi()
        .then(data => {
          if (data.courses) setExistingCourses(data.courses);
        })
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types & size
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

    const finalExamType = examType === 'Other' ? customExamType.trim() : examType;

    if (!course.trim()) {
      setError('Please enter or select a Course name.');
      return;
    }
    if (!year || isNaN(parseInt(year, 10))) {
      setError('Please enter a valid Year.');
      return;
    }
    if (!finalExamType) {
      setError('Please select or specify an Exam Type.');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Please upload at least one question paper image page.');
      return;
    }

    // Step 1: Perform Smart Duplication Check if not bypassed
    if (!bypassDuplicateCheck) {
      try {
        setLoading(true);
        const dupCheck = await checkDuplicatePaper(course.trim(), year, finalExamType);
        setLoading(false);

        if (dupCheck.exists && dupCheck.existingPaper) {
          setDuplicateWarningData(dupCheck.existingPaper);
          return; // Pause execution to let user decide in modal
        }
      } catch (err) {
        console.error('Duplicate check error:', err);
        // Continue if duplicate check API fails
        setLoading(false);
      }
    }

    // Step 2: Perform actual upload
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('course', course.trim());
      formData.append('year', year);
      formData.append('exam_type', finalExamType);

      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const res = await uploadPaperApi(formData);
      setLoading(false);

      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setBypassDuplicateCheck(false);
      setDuplicateWarningData(null);

      if (onSuccessUpload) onSuccessUpload(res.paper);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to upload paper.');
    }
  };

  const handleProceedAnyway = () => {
    setBypassDuplicateCheck(true);
    setDuplicateWarningData(null);
    // Trigger submit directly
    setTimeout(() => {
      const formElement = document.getElementById('upload-paper-form');
      if (formElement) formElement.requestSubmit();
    }, 50);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={onClose}>
        <div 
          className="window-card bg-white dark:bg-[#132238] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#5798D7]/30 max-h-[90vh] flex flex-col relative overflow-hidden"
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
              <div className="flex items-center space-x-2 pl-2">
                <Upload className="w-4 h-4 text-black dark:text-white" />
                <h2 className="text-sm font-black text-black dark:text-white tracking-tight">
                  Upload Question Paper
                </h2>
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
          <form id="upload-paper-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start space-x-3 text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Course Field with Datalist Suggestions */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="courses-suggestions"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Data Structures, DBMS, Operating Systems"
                className="w-full px-4 py-2.5 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all"
                required
              />
              <datalist id="courses-suggestions">
                {existingCourses.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>
            </div>

            {/* Grid for Year & Exam Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Year Field */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all font-mono"
                  required
                />
              </div>

              {/* Exam Type Field */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all"
                >
                  <option value="Midsem">Midsem</option>
                  <option value="Endsem">Endsem / Semester</option>
                  <option value="Quiz / Test">Quiz / Test</option>
                  <option value="Assignment / Lab">Assignment / Lab</option>
                  <option value="Other">Other...</option>
                </select>
              </div>

            </div>

            {examType === 'Other' && (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">
                  Specify Custom Exam Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customExamType}
                  onChange={(e) => setCustomExamType(e.target.value)}
                  placeholder="e.g. Sessional Exam"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all"
                  required
                />
              </div>
            )}

            {/* File Upload Drop Zone */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200">
                  Question Paper Page Image(s) <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-black/60 dark:text-slate-400 font-semibold">
                  Multiple pages supported (JPG, PNG, WebP)
                </span>
              </div>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#5798D7]/40 hover:border-[#5798D7] rounded-2xl bg-[#E6F1FA]/40 dark:bg-[#0E1828]/60 hover:bg-[#E6F1FA] dark:hover:bg-[#16253C]/80 cursor-pointer transition-colors group">
                <FileImage className="w-10 h-10 text-black/60 dark:text-slate-400 group-hover:text-[#5798D7] transition-colors mb-2" />
                <p className="text-sm font-bold text-black dark:text-white">
                  Click or drag images to upload pages
                </p>
                <p className="text-xs text-black/60 dark:text-slate-400 mt-1 font-medium">
                  Upload page 1, page 2, etc. in correct order
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

            {/* Selected File Previews */}
            {previews.length > 0 && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-black dark:text-slate-200 mb-2">
                  Uploaded Page Order ({previews.length} page{previews.length !== 1 ? 's' : ''})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previews.map((src, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] aspect-[3/4]">
                      <img src={src} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white border border-[#5798D7]/30 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shadow-xs">
                        P{index + 1}
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

            {/* Submit Buttons */}
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
                  <span>Processing...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-black" />
                    <span>Upload Paper</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Duplicate Warning Modal popup */}
      <DuplicateWarningModal
        isOpen={!!duplicateWarningData}
        existingPaper={duplicateWarningData}
        onViewExisting={(paperId) => {
          setDuplicateWarningData(null);
          onClose();
          if (onViewPaper) onViewPaper(paperId);
        }}
        onCancel={() => setDuplicateWarningData(null)}
        onProceedAnyway={handleProceedAnyway}
      />
    </>
  );
}
