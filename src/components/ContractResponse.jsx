import React from 'react';

const ContractResponse = ({ data, onExcerptClick }) => {
  // Handle backend response wrapper { "result": "..." }
  if (data && typeof data === 'object' && data.result) {
    data = data.result;
  }

  // Handle if data is a string (fallback)
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      data = parsed;
    } catch (e) {
      // If parsing fails, render as plain text
      return <p>{data}</p>;
    }
  }

  // If data is not an object or is null, render as string
  if (!data || typeof data !== 'object') {
    return <p>{String(data)}</p>;
  }

  const { 
    answer, 
    clauses, 
    summary, 
    key_points,
    key_obligations,
    risks_or_flags,
    excerpt,
    excerpt_translation_en,
    excerpt_page_no,
    document_name
  } = data;

  // Risk level color mapping
  const getRiskColor = (level) => {
    const levelLower = level?.toLowerCase() || '';
    if (levelLower.includes('high')) return 'risk-high';
    if (levelLower.includes('medium')) return 'risk-medium';
    if (levelLower.includes('low')) return 'risk-low';
    return 'risk-neutral';
  };

  return (
    <div className="contract-response">
      {/* Document Name */}
      {document_name && (
        <div className="document-header">
          <span className="document-icon">📄</span>
          <span className="document-name">{document_name}</span>
        </div>
      )}

      {/* Main Answer */}
      {answer && (
        <div className="response-answer">
          <p>{answer}</p>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="response-section">
          <h3 className="section-title">Summary</h3>
          <div className="summary-box">
            <p>{summary}</p>
          </div>
        </div>
      )}

      {/* Excerpt Section */}
      {(excerpt || excerpt_translation_en) && (
        <div className="response-section">
          <h3 className="section-title">Relevant Excerpt</h3>
          <div className="excerpt-container">
            {excerpt_page_no && (
              <div className="excerpt-meta">
                <span className="page-badge">Page {excerpt_page_no}</span>
              </div>
            )}
            {excerpt && (
              <div 
                className={`excerpt-box ${onExcerptClick ? 'clickable' : ''}`}
                onClick={() => onExcerptClick && onExcerptClick(excerpt)}
                title={onExcerptClick ? "Click to highlight in PDF" : ""}
              >
                <p className="excerpt-label">Original Text:</p>
                <p className="excerpt-text">{excerpt}</p>
                {onExcerptClick && (
                  <span className="click-hint">👆 Click to highlight in PDF</span>
                )}
              </div>
            )}
            {excerpt_translation_en && (
              <div className="excerpt-translation">
                <p className="excerpt-label">Translation:</p>
                <p className="excerpt-text">{excerpt_translation_en}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Points */}
      {key_points && key_points.length > 0 && (
        <div className="response-section">
          <h3 className="section-title">Key Points</h3>
          <ul className="key-points-list">
            {key_points.map((point, index) => (
              <li key={index} className="key-point-item">
                <span className="point-bullet">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Obligations */}
      {key_obligations && key_obligations.length > 0 && (
        <div className="response-section">
          <h3 className="section-title">Key Obligations</h3>
          <div className="obligations-grid">
            {key_obligations.map((obligation, index) => (
              <div key={index} className="obligation-card">
                <div className="obligation-icon">✓</div>
                <p>{obligation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks or Flags */}
      {risks_or_flags && risks_or_flags.length > 0 && (
        <div className="response-section">
          <h3 className="section-title">Risks & Flags</h3>
          <div className="risks-list">
            {risks_or_flags.map((risk, index) => (
              <div key={index} className="risk-item">
                <span className="risk-icon">⚠️</span>
                <p>{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clauses */}
      {clauses && clauses.length > 0 && (
        <div className="response-section">
          <h3 className="section-title">Clause Analysis</h3>
          <div className="clauses-grid">
            {clauses.map((clause, index) => (
              <div key={index} className="clause-card">
                <div className="clause-header">
                  <span className="clause-number">Clause {clause.clause_number}</span>
                  {clause.risk_level && (
                    <span className={`risk-badge ${getRiskColor(clause.risk_level)}`}>
                      {clause.risk_level}
                    </span>
                  )}
                </div>
                
                {clause.clause_text && (
                  <div className="clause-text">
                    <p className="text-label">Text:</p>
                    <p className="text-content">{clause.clause_text}</p>
                  </div>
                )}
                
                {clause.analysis && (
                  <div className="clause-analysis">
                    <p className="analysis-label">Analysis:</p>
                    <p className="analysis-content">{clause.analysis}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractResponse;
