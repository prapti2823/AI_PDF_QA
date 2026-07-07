import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

const UploadCard = ({ uploadedFile, uploadProgress, isUploading, onUpload, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setValidationError('Only PDF files are supported. Please upload a .pdf file.');
      return;
    }
    setValidationError('');
    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
      <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <FileText size={16} className="text-[#3795BD]" />
        Upload PDF Document
      </h3>

      {/* Uploaded file state */}
      {uploadedFile && !isUploading ? (
        <div className="flex items-center gap-3 p-4 bg-[#EEF7FF] rounded-xl border border-[#3795BD]/20">
          <div className="w-10 h-10 bg-[#3795BD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-[#3795BD]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{uploadedFile.name}</p>
            <p className="text-xs text-slate-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
          </div>
          <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging ? 'border-[#3795BD] bg-[#EEF7FF] scale-[1.01]' : 'border-[#E5E7EB] hover:border-[#3795BD]/50 hover:bg-[#EEF7FF]/50'}
            ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => processFile(e.target.files[0])}
          />
          <div className="w-14 h-14 bg-gradient-to-br from-[#3795BD]/10 to-[#2563eb]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-[#3795BD]" />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">
            {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
          </p>
          <p className="text-xs text-slate-400 mb-4">or</p>
          <button
            type="button"
            className="bg-gradient-to-r from-[#3795BD] to-[#2563eb] text-white text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            Browse Files
          </button>
          <p className="text-xs text-slate-400 mt-3">PDF files only</p>
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Uploading & processing…</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3795BD] to-[#2563eb] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Validation error */}
      {validationError && (
        <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <p className="text-xs">{validationError}</p>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
