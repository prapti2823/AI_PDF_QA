import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
});

/**
 * Upload a PDF file to the backend.
 * @param {File} file - The PDF file to upload
 * @param {function} onProgress - Progress callback (0-100)
 */
export const uploadPDF = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
};

/**
 * Ask a question about the uploaded PDF.
 * @param {string} question - The user's question
 * @param {string} sessionId - Session identifier from upload response
 */
export const askQuestion = (question, sessionId) =>
  api.post('/ask', { question, session_id: sessionId });

export default api;
