import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ImageGuidelinesModal from "./components/ImageGuidelinesModal";
import UploadPaperModal from "./components/UploadPaperModal";
import PaperViewerModal from "./components/PaperViewerModal";

import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import PaperDetailPage from "./pages/PaperDetailPage";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

import {
  fetchPapers,
  getPaperDownloadUrl,
  deletePaperApi,
} from "./services/api";

export default function App() {
  // Theme state with localStorage persistence (defaults to false for the light Frost/Denim theme)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("pyq_dark_mode");
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Navigation tab state: 'home', 'browse', 'paper-detail'
  const [currentTab, setCurrentTab] = useState("home");
  const [selectedPaperId, setSelectedPaperId] = useState(null);

  // Modals state
  const [isUploadPaperOpen, setIsUploadPaperOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [viewerPaper, setViewerPaper] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { paper, onDeleted }
  const [isDeletingPaper, setIsDeletingPaper] = useState(false);

  // Recent papers for home page
  const [recentPapers, setRecentPapers] = useState([]);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("pyq_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Load recent papers
  const loadRecentPapers = async () => {
    try {
      const data = await fetchPapers();
      setRecentPapers(data);
    } catch (err) {
      console.error("Failed to load recent papers:", err);
    }
  };

  useEffect(() => {
    loadRecentPapers();
  }, []);

  // Handlers
  const handleViewPaper = (paperId) => {
    setSelectedPaperId(paperId);
    setCurrentTab("paper-detail");
  };

  const handleOpenPaperViewer = (paper) => {
    setViewerPaper(paper);
  };

  const handleDownloadPaper = (paperId) => {
    const downloadUrl = getPaperDownloadUrl(paperId);
    window.location.href = downloadUrl;
  };

  const handleViewSolutions = (paperId) => {
    setSelectedPaperId(paperId);
    setCurrentTab("paper-detail");
  };

  const handleSuccessUpload = (newPaper) => {
    loadRecentPapers();
    handleViewPaper(newPaper.id);
  };

  const handleRequestDeletePaper = (paper, onDeletedCallback) => {
    setDeleteTarget({ paper, onDeleted: onDeletedCallback });
  };

  const handleConfirmDelete = async (paperId) => {
    try {
      setIsDeletingPaper(true);
      await deletePaperApi(paperId);
      if (deleteTarget?.onDeleted) {
        deleteTarget.onDeleted();
      }
      await loadRecentPapers();
      if (currentTab === "paper-detail" && selectedPaperId === paperId) {
        setCurrentTab("browse");
        setSelectedPaperId(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete paper:", err);
      alert(err.message || "Failed to delete question paper.");
    } finally {
      setIsDeletingPaper(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenUploadModal={() => setIsUploadPaperOpen(true)}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === "home" && (
          <HomePage
            recentPapers={recentPapers}
            onNavigateBrowse={() => setCurrentTab("browse")}
            onOpenUpload={() => setIsUploadPaperOpen(true)}
            onViewPaper={handleViewPaper}
            onDownloadPaper={handleDownloadPaper}
            onViewSolutions={handleViewSolutions}
            onDeletePaper={handleRequestDeletePaper}
          />
        )}

        {currentTab === "browse" && (
          <BrowsePage
            onViewPaper={handleViewPaper}
            onDownloadPaper={handleDownloadPaper}
            onViewSolutions={handleViewSolutions}
            onOpenUpload={() => setIsUploadPaperOpen(true)}
            onDeletePaper={handleRequestDeletePaper}
          />
        )}

        {currentTab === "paper-detail" && (
          <PaperDetailPage
            paperId={selectedPaperId}
            onBack={() => setCurrentTab("browse")}
            onViewPaperViewer={handleOpenPaperViewer}
            onDeletePaper={handleRequestDeletePaper}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-ui)] bg-[var(--footer-bg)] py-8 text-center text-xs text-[var(--text-secondary)] font-semibold transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} PYQVault — Student Question Paper
            Repository
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsGuidelinesOpen(true)}
              className="hover:text-[#326da6] transition-colors cursor-pointer"
            >
              Upload Guidelines
            </button>
            <span>•</span>
            <span>No Auth Required</span>
          </div>
        </div>
      </footer>

      {/* Upload Paper Modal */}
      <UploadPaperModal
        isOpen={isUploadPaperOpen}
        onClose={() => setIsUploadPaperOpen(false)}
        onSuccessUpload={handleSuccessUpload}
        onViewPaper={handleViewPaper}
      />

      {/* Guidelines Modal */}
      <ImageGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      {/* In-Browser Paper Viewer Modal */}
      {viewerPaper && (
        <PaperViewerModal
          paper={viewerPaper}
          onClose={() => setViewerPaper(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        paper={deleteTarget?.paper}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingPaper}
      />
    </div>
  );
}
