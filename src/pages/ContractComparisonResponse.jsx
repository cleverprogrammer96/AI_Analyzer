import React from 'react';

const ContractComparisonResponse = ({ data }) => {
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
      return <p>{data}</p>;
    }
  }

  // If data is not an object or is null, render as string
  if (!data || typeof data !== 'object') {
    return <p>{String(data)}</p>;
  }

  const {
    comparison_table,
    overall_comparison_summary,
    confidence
  } = data;

  // Get comparison type badge color
  const getComparisonTypeColor = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower === 'similarity') return 'comparison-similarity';
    if (typeLower === 'difference') return 'comparison-difference';
    return 'comparison-neutral';
  };

  // Get confidence badge color
  const getConfidenceColor = (level) => {
    const levelLower = level?.toLowerCase() || '';
    if (levelLower === 'high') return 'confidence-high';
    if (levelLower === 'medium') return 'confidence-medium';
    if (levelLower === 'low') return 'confidence-low';
    return 'confidence-neutral';
  };

  return (
    <div className="comparison-response">
      {/* Overall Summary */}
      {overall_comparison_summary && (
        <div className="response-section">
          <div className="comparison-summary-header">
            <h3 className="section-title">Comparison Summary</h3>
            {confidence && (
              <span className={`confidence-badge ${getConfidenceColor(confidence)}`}>
                {confidence} Confidence
              </span>
            )}
          </div>
          <div className="summary-box">
            <p>{overall_comparison_summary}</p>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {comparison_table && comparison_table.length > 0 && (
        <div className="response-section">
          <h3 className="section-title">Clause-by-Clause Comparison</h3>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="clause-header">Clause</th>
                  <th className="document-header">Document 1</th>
                  <th className="document-header">Document 2</th>
                  <th className="comparison-header">Analysis</th>
                </tr>
              </thead>
              <tbody>
                {comparison_table.map((row, idx) => (
                  <tr key={idx} className="comparison-row">
                    <td className="clause-cell">
                      <div className="clause-id-badge">{row.clause_id}</div>
                      <div className="clause-name">{row.clause_name}</div>
                    </td>
                    <td className="document-cell">
                      <div className="document-content">
                        <p className="canonical-summary">{row.document_1}</p>
                      </div>
                    </td>
                    <td className="document-cell">
                      <div className="document-content">
                        <p className="canonical-summary">{row.document_2}</p>
                      </div>
                    </td>
                    <td className="analysis-cell">
                      {row.comparison_type && (
                        <span className={`comparison-type-badge ${getComparisonTypeColor(row.comparison_type)}`}>
                          {row.comparison_type === 'similarity' ? '≈ Similar' : '≠ Different'}
                        </span>
                      )}
                      {row.notes && (
                        <p className="comparison-notes">{row.notes}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractComparisonResponse;