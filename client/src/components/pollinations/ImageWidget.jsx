import React, { useState } from 'react';

const ImageIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7m4 2v4h4M9 15l6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const LoaderIcon = () => (
  <svg 
    className="spinner" 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
  </svg>
);

const ImageWidget = () => {
  const [widgetState, setWidgetState] = useState({
    isOpen: false,
    prompt: '',
    loading: false,
    generatedImage: '',
    error: '',
  });
  
  const { isOpen, prompt, loading, generatedImage, error } = widgetState;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setWidgetState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;
      setWidgetState(prev => ({
        ...prev,
        generatedImage: imageUrl,
        loading: false,
      }));
    } catch (error) {
      console.error('Image generation error:', error);
      setWidgetState(prev => ({
        ...prev,
        error: 'Failed to generate image. Please try again.',
        loading: false,
      }));
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const timestamp = new Date().getTime();
      link.download = `generated-image-${timestamp}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      setWidgetState(prev => ({
        ...prev,
        error: 'Failed to download image. Please try again.',
      }));
    }
  };

  return (
    <div className="widget-container">
      <button
        className="widget-toggle"
        onClick={() => setWidgetState(prev => ({ ...prev, isOpen: !prev.isOpen }))}
      >
        <ImageIcon />
      </button>
      {isOpen && (
        <div className="widget-card">
          <div className="widget-header">
            <h3>Generate Image</h3>
            <button
              className="close-button"
              onClick={() => setWidgetState(prev => ({ ...prev, isOpen: false }))}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="widget-content">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter your image description..."
                value={prompt}
                onChange={(e) => setWidgetState(prev => ({ ...prev, prompt: e.target.value }))}
                disabled={loading}
              />
            </div>
            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <>
                  <LoaderIcon />
                  <span>Generating...</span>
                </>
              ) : 'Generate Image'}
            </button>
            {error && <p className="error-message">{error}</p>}
            {generatedImage && (
              <div className="generated-image">
                <img 
                  src={generatedImage} 
                  alt="Generated content" 
                  onClick={handleDownload}
                  style={{ cursor: 'pointer' }}
                  title="Click to download"
                />
                    <p className="download-instruction">Click on image to download</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default ImageWidget