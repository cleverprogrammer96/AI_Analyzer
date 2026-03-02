import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ file, highlightText, onLoadSuccess, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(560);
  const containerRef = useRef(null);

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

  // NEW: DOM-based highlighting (works with phrases!)
  useEffect(() => {
    if (!normalizedHighlight) return;

    console.log('Attempting to highlight:', normalizedHighlight);

    // Wait for text layer to render
    const timer = setTimeout(() => {
      const textLayer = document.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) {
        console.log('Text layer not found');
        return;
      }

      // Get all text spans
      const spans = textLayer.querySelectorAll('span');
      console.log('Found spans:', spans.length);

      let found = false;

      spans.forEach((span) => {
        const text = span.textContent.toLowerCase();
        
        // Check if this span contains the search text
        if (text.includes(normalizedHighlight)) {
          span.style.backgroundColor = 'yellow';
          span.style.padding = '2px';
          span.style.borderRadius = '2px';
          found = true;
          console.log('Highlighted span:', span.textContent);
        }
      });

      if (!found) {
        console.log('Text not found in any span');
        console.log('Searching for:', normalizedHighlight);
      }
    }, 500); // Wait for text layer to render

    // Cleanup function
    return () => {
      clearTimeout(timer);
      const textLayer = document.querySelector('.react-pdf__Page__textContent');
      if (textLayer) {
        const spans = textLayer.querySelectorAll('span');
        spans.forEach((span) => {
          span.style.backgroundColor = '';
          span.style.padding = '';
          span.style.borderRadius = '';
        });
      }
    };
  }, [normalizedHighlight, pageNumber]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    setPageNumber(1);
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
    console.log('PDF loaded successfully:', numPages, 'pages');
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