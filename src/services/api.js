/**
 * API Service Layer
 * 
 * Centralized API communication logic. Update BASE_URL with your actual backend URL.
 */

// TODO: Replace with your actual backend URL
const BASE_URL = 'http://localhost:8000';

/**
 * Generate a response from the LLM
 * @param {string} query - User's question/prompt
 * @returns {Promise<any>} - LLM response (could be JSON or string)
 */
export const generateResponse = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/generate/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // If your API returns structured JSON with a specific format, parse it here
    // For example: return data.response or data.answer
    return data;
    
  } catch (error) {
    console.error('Error calling generate API:', error);
    throw error;
  }
};

/**
 * Upload contract file(s) for embedding generation
 * @param {FileList|File[]} files - Contract files to upload
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<any>} - Upload response
 */
export const uploadContract = async (files, onProgress) => {
  try {
    const formData = new FormData();
    
    // Add all files to FormData
    Array.from(files).forEach((file, index) => {
      formData.append('files', file);
    });

    const response = await fetch(`${BASE_URL}/upload/contract`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header, browser will set it with boundary
    });

    if (!response.ok) {
      throw new Error(`Upload error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error uploading contract:', error);
    throw error;
  }
};

/**
 * Generic API call wrapper for future endpoints
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};
