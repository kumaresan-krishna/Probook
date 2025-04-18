import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import '../styles/ShareableBookshelf.css';
import { LibraryEntry } from '../pages/LibraryPage';

interface ShareableBookshelfProps {
  entries: LibraryEntry[];
  username?: string;
  onClose: () => void;
}

const ShareableBookshelf: React.FC<ShareableBookshelfProps> = ({ entries, username = "User", onClose }) => {
  const [layoutRatio, setLayoutRatio] = useState<'9:16' | '1:1' | '4:5'>('4:5');
  const bookshelfRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateImage = async () => {
    if (bookshelfRef.current) {
      setIsGenerating(true);
      try {
        const canvas = await html2canvas(bookshelfRef.current, {
          scale: 2, // Higher resolution
          backgroundColor: null,
          logging: false,
          useCORS: true // To handle cross-origin images
        } as any);
        
        // Convert to image and trigger download
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `my-bookshelf-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  const getLayoutClass = () => {
    switch (layoutRatio) {
      case '9:16': return 'vertical';
      case '1:1': return 'square';
      case '4:5': return 'portrait';
      default: return 'portrait';
    }
  };
  
  return (
    <div className="shareable-container">
      <div className="controls">
        <h2>Create Shareable Image</h2>
        <div className="ratio-selector">
          <label>Layout Ratio:</label>
          <div className="ratio-buttons">
            <button 
              className={layoutRatio === '9:16' ? 'active' : ''} 
              onClick={() => setLayoutRatio('9:16')}
            >
              Vertical (9:16)
            </button>
            <button 
              className={layoutRatio === '1:1' ? 'active' : ''} 
              onClick={() => setLayoutRatio('1:1')}
            >
              Square (1:1)
            </button>
            <button 
              className={layoutRatio === '4:5' ? 'active' : ''} 
              onClick={() => setLayoutRatio('4:5')}
            >
              Portrait (4:5)
            </button>
          </div>
        </div>
        <div className="action-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="download-btn" 
            onClick={generateImage}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Download Image'}
          </button>
        </div>
      </div>
      
      <div className={`bookshelf-preview ${getLayoutClass()}`}>
        <div ref={bookshelfRef} className="bookshelf-content">
          <div className="books-collection">
            {entries.map(entry => {
                if (!entry?.book) return null; 
                const { book } = entry;
                return (
                  <div key={entry.id} className="book-item">
                    <div className="book-cover-wrapper">
                      <img 
                        src={book.cover_image_url || '/placeholder-book.png'} 
                        alt={`${book.title || 'Book'} cover`} 
                        className="book-cover-image"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="book-details">
                      <h3 className="book-title">{book.title || '[No Title]'}</h3>
                      <p className="book-author">by {book.author || '[No Author]'}</p>
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="bookshelf-watermark">
            @{username} • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableBookshelf; 