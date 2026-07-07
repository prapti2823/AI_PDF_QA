import { useState, useCallback } from 'react';
import { uploadPDF, askQuestion } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = useCallback(async (file) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    try {
      const res = await uploadPDF(file, setUploadProgress);
      setSessionId(res.data.session_id);
      setUploadedFile(file);
      setMessages([]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleAsk = useCallback(async (question) => {
    if (!question.trim() || !sessionId) return;

    const userMsg = { role: 'user', content: question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsAsking(true);
    setError(null);

    try {
      const res = await askQuestion(question, sessionId);
      const aiMsg = {
        role: 'ai',
        content: res.data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get an answer. Please try again.');
    } finally {
      setIsAsking(false);
    }
  }, [sessionId]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setSessionId(null);
    setMessages([]);
    setUploadProgress(0);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    uploadedFile,
    uploadProgress,
    isUploading,
    isAsking,
    error,
    sessionId,
    handleUpload,
    handleAsk,
    handleRemoveFile,
    clearError,
  };
};
