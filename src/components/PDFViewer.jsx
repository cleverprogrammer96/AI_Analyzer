import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ file, highlightText, onLoadSuccess, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(560);
  const containerRef = useRef(null);
  
  // Match tracking for navigation
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const pdfDocumentRef = useRef(null);

  useEffect(() => {
    setPageNumber(1);
    setError(null);
  }, [file]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = () => {
      const nextWidth = Math.max(260, Math.floor(node.clientWidth - 32));
      setPageWidth(nextWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const normalizedHighlight = useMemo(
    () => (highlightText || '').trim().toLowerCase(),
    [highlightText]
  );

  // NEW: Search all pages for matches
  const searchAllPages = async (searchText, pdfDoc) => {
    if (!pdfDoc || !searchText) return [];

    console.log('Searching all pages for:', searchText);
    setIsSearching(true);
    
    const allMatches = [];

    try {
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine all text items on this page
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .toLowerCase();

        // Check if this page contains the search text
        if (pageText.includes(searchText)) {
          allMatches.push({
            pageNumber: pageNum,
            hasMatch: true
          });
          console.log(`Found match on page ${pageNum}`);
        }
      }
    } catch (error) {
      console.error('Error searching pages:', error);
    }

    setIsSearching(false);
    setSearchComplete(true);
    return allMatches;
  };

  // When highlight text changes, search all pages
  useEffect(() => {
    if (!normalizedHighlight || !pdfDocumentRef.current) {
      setMatches([]);
      setCurrentMatchIndex(0);
      setSearchComplete(false);
      return;
    }

    // Search all pages
    searchAllPages(normalizedHighlight, pdfDocumentRef.current).then((foundPages) => {
      if (foundPages.length > 0) {
        // Navigate to first page with match
        const firstMatchPage = foundPages[0].pageNumber;
        console.log(`Navigating to page ${firstMatchPage} (first match)`);
        setPageNumber(firstMatchPage);
      } else {
        console.log('No matches found in any page');
      }
    });
  }, [normalizedHighlight]);

  // Highlight matches on current page (after page loads)
  useEffect(() => {
    if (!normalizedHighlight || !searchComplete) return;

    console.log('Highlighting on current page:', pageNumber);

    const timer = setTimeout(() => {
      const textLayer = document.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) {
        console.log('Text layer not found');
        return;
      }

      const spans = textLayer.querySelectorAll('span');
      const foundMatches = [];

      spans.forEach((span, index) => {
        const text = span.textContent.toLowerCase();
        
        if (text.includes(normalizedHighlight)) {
          foundMatches.push({ 
            span, 
            index,
            pageNumber: pageNumber 
          });
          
          // Apply highlight styles
          span.style.backgroundColor = 'rgba(255, 235, 59, 0.4)';
          span.style.padding = '2px 4px';
          span.style.borderRadius = '3px';
          span.style.transition = 'all 0.3s ease';
          span.style.boxShadow = '0 0 8px rgba(255, 193, 7, 0.3)';
          span.classList.add('pdf-match');
        }
      });

      setMatches(foundMatches);
      
      if (foundMatches.length > 0) {
        setCurrentMatchIndex(0);
        highlightActiveMatch(foundMatches[0].span);
        scrollToMatch(foundMatches[0].span);
      }

      console.log(`Found ${foundMatches.length} matches on page ${pageNumber}`);
    }, 500);

    return () => {
      clearTimeout(timer);
      const textLayer = document.querySelector('.react-pdf__Page__textContent');
      if (textLayer) {
        const spans = textLayer.querySelectorAll('span');
        spans.forEach((span) => {
          span.style.backgroundColor = '';
          span.style.padding = '';
          span.style.borderRadius = '';
          span.style.transition = '';
          span.style.boxShadow = '';
          span.classList.remove('pdf-match', 'pdf-active-match');
        });
      }
      setMatches([]);
      setCurrentMatchIndex(0);
    };
  }, [normalizedHighlight, pageNumber, searchComplete]);

  const highlightActiveMatch = (activeSpan) => {
    document.querySelectorAll('.pdf-active-match').forEach((span) => {
      span.style.backgroundColor = 'rgba(255, 235, 59, 0.4)';
      span.style.boxShadow = '0 0 8px rgba(255, 193, 7, 0.3)';
      span.classList.remove('pdf-active-match');
    });

    if (activeSpan) {
      activeSpan.style.backgroundColor = 'rgba(255, 152, 0, 0.5)';
      activeSpan.style.boxShadow = '0 0 12px rgba(255, 152, 0, 0.6)';
      activeSpan.classList.add('pdf-active-match');
    }
  };

  const scrollToMatch = (span) => {
    if (span) {
      span.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goToNextMatch = () => {
    if (matches.length === 0) return;
    
    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
    highlightActiveMatch(matches[nextIndex].span);
    scrollToMatch(matches[nextIndex].span);
  };

  const goToPrevMatch = () => {
    if (matches.length === 0) return;
    
    const prevIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prevIndex);
    highlightActiveMatch(matches[prevIndex].span);
    scrollToMatch(matches[prevIndex].span);
  };

  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    setError(null);
    setPageNumber(1);
    
    // Store the PDF document proxy correctly
    pdfDocumentRef.current = pdf;
    
    if (onLoadSuccess) {
      onLoadSuccess(pdf.numPages);
    }
    console.log('PDF loaded successfully:', pdf.numPages, 'pages');
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setError(error.message || 'Failed to load PDF');
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  console.log('PDFViewer rendering with file:', file);

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button 
          onClick={goToPrevPage} 
          disabled={pageNumber <= 1}
          className="pdf-nav-btn"
        >
          ← Previous
        </button>
        <span className="pdf-page-info">
          {numPages ? `Page ${pageNumber} of ${numPages}` : 'Loading...'}
        </span>
        <button 
          onClick={goToNextPage} 
          disabled={pageNumber >= numPages}
          className="pdf-nav-btn"
        >
          Next →
        </button>
        
        {/* Search status */}
        {isSearching && (
          <span className="search-status">Searching...</span>
        )}
        
        {/* Match navigation */}
        {matches.length > 0 && (
          <>
            <div className="match-divider" />
            <button 
              onClick={goToPrevMatch}
              className="match-nav-btn"
              title="Previous match"
            >
              ↑
            </button>
            <span className="match-counter">
              {currentMatchIndex + 1} of {matches.length}
            </span>
            <button 
              onClick={goToNextMatch}
              className="match-nav-btn"
              title="Next match"
            >
              ↓
            </button>
          </>
        )}
        
        {onClose && (
          <button 
            onClick={onClose}
            className="pdf-close-btn"
            title="Close PDF"
          >
            ✕
          </button>
        )}
      </div>

      <div className="pdf-document-container" ref={containerRef}>
        {error ? (
          <div className="pdf-error">
            <p>❌ Error loading PDF</p>
            <p style={{ fontSize: '0.875rem', color: 'red' }}>{error}</p>
            <p style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
              File path: {file}
            </p>
            <p style={{ fontSize: '0.75rem' }}>
              Make sure the file exists in the public folder
            </p>
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            onSourceError={onDocumentLoadError}
            loading={
              <div className="pdf-loading">
                <div className="loading-spinner"></div>
                <p>Loading PDF...</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  {file}
                </p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              onRenderError={onDocumentLoadError}
              width={pageWidth}
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;