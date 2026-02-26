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

  // Highlight text callback
  const customTextRenderer = (textItem) => {
    const rawText = textItem?.str || '';
    if (!normalizedHighlight) return rawText;

    const text = rawText;
    
    if (text.toLowerCase().includes(normalizedHighlight)) {
      return (
        <mark className="pdf-highlight">{text}</mark>
      );
    }
    
    return text;
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
              customTextRenderer={customTextRenderer}
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
