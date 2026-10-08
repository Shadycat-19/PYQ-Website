import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, BookOpen, Upload, Sparkles } from 'lucide-react';
import PaperCard from '../components/PaperCard';
import { fetchPapers, fetchMetaOptionsApi } from '../services/api';

export default function BrowsePage({ 
  onViewPaper, 
  onDownloadPaper, 
  onViewSolutions, 
  onOpenUpload,
  onDeletePaper
}) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedExamType, setSelectedExamType] = useState('All');

  // Metadata dropdown options
  const [coursesList, setCoursesList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [examTypesList, setExamTypesList] = useState([]);

  useEffect(() => {
    fetchMetaOptionsApi()
      .then(meta => {
        if (meta.courses) setCoursesList(meta.courses);
        if (meta.years) setYearsList(meta.years);
        if (meta.examTypes) setExamTypesList(meta.examTypes);
      })
      .catch(console.error);
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const data = await fetchPapers({
        course: selectedCourse,
        year: selectedYear,
        exam_type: selectedExamType,
        search
      });
      setPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [selectedCourse, selectedYear, selectedExamType, search]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCourse('All');
    setSelectedYear('All');
    setSelectedExamType('All');
  };

  const hasActiveFilters = search !== '' || selectedCourse !== 'All' || selectedYear !== 'All' || selectedExamType !== 'All';

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
            Browse Question Papers
          </h1>
          <p className="text-sm font-semibold text-black/70 dark:text-slate-400 mt-1">
            Filter, search, view, and download previous-year question papers
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#B9C255] hover:bg-[#A7B142] text-black text-sm font-extrabold shadow-sm border border-[#8F9836]/40 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4 text-black" />
          <span>Upload Paper</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#132238] p-6 rounded-3xl border border-[#5798D7]/25 shadow-sm space-y-4 transition-colors">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black/50 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Course name, Year (e.g. 2025), or Exam Type..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white placeholder:text-black/45 dark:placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Course Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all"
            >
              <option value="All">All Courses</option>
              {coursesList.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all font-mono"
            >
              <option value="All">All Years</option>
              {yearsList.map((y, i) => (
                <option key={i} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Exam Type Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-black dark:text-slate-300 mb-1">
              Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#5798D7]/30 bg-[#F4F8FC] dark:bg-[#0E1828] focus:bg-white dark:focus:bg-[#16253C] text-black dark:text-white font-semibold text-sm focus:ring-2 focus:ring-[#5798D7] focus:outline-none transition-all"
            >
              <option value="All">All Exam Types</option>
              <option value="Midsem">Midsem</option>
              <option value="Endsem">Endsem / Semester</option>
              {examTypesList.filter(t => t !== 'Midsem' && t !== 'Endsem').map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear Filters Toolbar */}
        {hasActiveFilters && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-extrabold text-black dark:text-white bg-[#E6F1FA] dark:bg-[#1A2C46] hover:bg-[#D4E6F5] dark:hover:bg-[#233B5C] rounded-xl border border-[#5798D7]/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-black dark:text-slate-300 font-bold">
        <span>Showing {papers.length} question paper{papers.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid of Cards or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-[#E6F1FA] dark:bg-[#1A2C46] border border-[#5798D7]/30 rounded-2xl" />
          ))}
        </div>
      ) : papers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onView={onViewPaper}
              onDownload={onDownloadPaper}
              onViewSolutions={onViewSolutions}
              onDelete={onDeletePaper ? (p) => onDeletePaper(p, () => setPapers(prev => prev.filter(item => item.id !== p.id))) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#132238] rounded-3xl border border-[#5798D7]/25 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E6F1FA] dark:bg-[#1A2C46] text-black dark:text-white mx-auto flex items-center justify-center border border-[#5798D7]/30">
            <BookOpen className="w-7 h-7 text-black dark:text-white" />
          </div>
          <h3 className="text-lg font-black text-black dark:text-white">
            No papers match your search criteria
          </h3>
          <p className="text-sm font-medium text-black/70 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your course, year, or exam type filters, or upload a paper if you have it!
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-[#E6F1FA] dark:bg-[#1A2C46] hover:bg-[#D4E6F5] dark:hover:bg-[#233B5C] text-black dark:text-white text-xs font-bold rounded-xl border border-[#5798D7]/30 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={onOpenUpload}
              className="px-5 py-2 bg-[#B9C255] hover:bg-[#A7B142] text-black text-xs font-extrabold rounded-xl shadow-xs border border-[#8F9836]/40 transition-colors cursor-pointer"
            >
              Upload Paper
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
