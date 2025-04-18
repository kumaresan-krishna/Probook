import React, { useState, useEffect } from 'react';
import { BookshelfService } from '../lib/bookshelfService';
import { CustomBookshelf, Book } from '../types';
import '../styles/CustomBookshelves.css';

interface CustomBookshelvesProps {
  books: Book[];
  onSelectShelf: (bookIds: string[]) => void;
}

const CustomBookshelves: React.FC<CustomBookshelvesProps> = ({ books, onSelectShelf }) => {
  const [bookshelves, setBookshelves] = useState<CustomBookshelf[]>([]);
  const [isCreatingShelf, setIsCreatingShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfDescription, setNewShelfDescription] = useState('');
  const [newShelfEmoji, setNewShelfEmoji] = useState('');
  
  useEffect(() => {
    // Load bookshelves
    const loadedShelves = BookshelfService.getAllBookshelves();
    setBookshelves(loadedShelves);
  }, []);
  
  const handleCreateShelf = () => {
    if (!newShelfName.trim()) return;
    
    const newShelf = BookshelfService.createBookshelf(
      newShelfName.trim(),
      newShelfDescription.trim() || undefined,
      newShelfEmoji.trim() || undefined
    );
    
    setBookshelves([...bookshelves, newShelf]);
    setIsCreatingShelf(false);
    resetForm();
  };
  
  const handleDeleteShelf = (shelfId: string) => {
    if (window.confirm('Are you sure you want to delete this bookshelf?')) {
      const success = BookshelfService.deleteBookshelf(shelfId);
      if (success) {
        setBookshelves(bookshelves.filter(shelf => shelf.id !== shelfId));
      }
    }
  };
  
  const resetForm = () => {
    setNewShelfName('');
    setNewShelfDescription('');
    setNewShelfEmoji('');
  };
  
  const getBookCount = (shelfId: string) => {
    const shelf = bookshelves.find(s => s.id === shelfId);
    return shelf ? shelf.bookIds.length : 0;
  };
  
  const renderEmoji = (emoji?: string) => {
    return emoji || '📚';
  };
  
  return (
    <div className="custom-bookshelves">
      <div className="bookshelves-header">
        <h2>My Custom Bookshelves</h2>
        {!isCreatingShelf && (
          <button 
            className="new-shelf-btn"
            onClick={() => setIsCreatingShelf(true)}
          >
            + New Bookshelf
          </button>
        )}
      </div>
      
      {isCreatingShelf && (
        <div className="create-shelf-form">
          <h3>Create New Bookshelf</h3>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              placeholder="e.g., Books that made me cry"
              maxLength={50}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description (optional)</label>
            <input 
              type="text"
              value={newShelfDescription}
              onChange={(e) => setNewShelfDescription(e.target.value)}
              placeholder="What kind of books go here?"
              maxLength={100}
            />
          </div>
          
          <div className="form-group">
            <label>Emoji (optional)</label>
            <input 
              type="text"
              value={newShelfEmoji}
              onChange={(e) => setNewShelfEmoji(e.target.value)}
              placeholder="e.g., 😭"
              maxLength={2}
            />
          </div>
          
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={() => {
                setIsCreatingShelf(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button 
              className="create-btn"
              onClick={handleCreateShelf}
              disabled={!newShelfName.trim()}
            >
              Create Shelf
            </button>
          </div>
        </div>
      )}
      
      <div className="bookshelves-list">
        {bookshelves.map(shelf => (
          <div key={shelf.id} className="bookshelf-item">
            <div 
              className="bookshelf-details"
              onClick={() => onSelectShelf(shelf.bookIds)}
            >
              <div className="bookshelf-icon">{renderEmoji(shelf.emoji)}</div>
              <div className="bookshelf-info">
                <h3>{shelf.name}</h3>
                {shelf.description && <p>{shelf.description}</p>}
                <span className="book-count">
                  {getBookCount(shelf.id)} {getBookCount(shelf.id) === 1 ? 'book' : 'books'}
                </span>
              </div>
            </div>
            <button 
              className="delete-shelf-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteShelf(shelf.id);
              }}
              aria-label="Delete shelf"
            >
              ×
            </button>
          </div>
        ))}
        
        {bookshelves.length === 0 && !isCreatingShelf && (
          <div className="empty-state">
            <p>You don't have any custom bookshelves yet.</p>
            <p>Create one to organize your books in unique ways!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomBookshelves; 