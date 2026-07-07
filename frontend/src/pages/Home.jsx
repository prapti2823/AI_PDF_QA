import { useChat } from '../hooks/useChat';
import UploadCard from '../components/UploadCard';
import ChatWindow from '../components/ChatWindow';
import ErrorAlert from '../components/ErrorAlert';

const Home = () => {
  const {
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
  } = useChat();

  return (
    <main className="flex-1 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Error banner */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={clearError} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Left column: Upload */}
          <div className="space-y-4">
            <UploadCard
              uploadedFile={uploadedFile}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              onUpload={handleUpload}
              onRemove={handleRemoveFile}
            />

            {/* Tips card */}
            <div className="bg-gradient-to-br from-[#EEF7FF] to-white rounded-2xl border border-[#3795BD]/15 p-5">
              <p className="text-xs font-semibold text-[#3795BD] uppercase tracking-wide mb-3">Tips</p>
              <ul className="space-y-2">
                {[
                  'Ask specific questions for precise answers',
                  'Reference page numbers for targeted queries',
                  'Ask for summaries of sections',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="w-1 h-1 rounded-full bg-[#3795BD] mt-1.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column: Chat */}
          <ChatWindow
            messages={messages}
            isAsking={isAsking}
            sessionId={sessionId}
            onAsk={handleAsk}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
