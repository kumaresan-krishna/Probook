import React, { useState, useEffect } from 'react';
import { BookshelfService } from '../lib/bookshelfService';
import { CustomBookshelf } from '../types';
import '../styles/AddToBookshelfModal.css';

interface AddToBookshelfModalProps {
  bookId: string;
  onClose: () => void;
}

const AddToBookshelfModal: React.FC<AddToBookshelfModalProps> = ({ bookId, onClose }) => {
  const [bookshelves, setBookshelves] = useState<CustomBookshelf[]>([]);
  const [selectedShelfIds, setSelectedShelfIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfEmoji, setNewShelfEmoji] = useState('');
  const [newShelfDescription, setNewShelfDescription] = useState('');
  
  useEffect(() => {
    // Load bookshelves and check which ones already contain this book
    const loadBookshelves = () => {
      setLoading(true);
      const allShelves = BookshelfService.getAllBookshelves();
      setBookshelves(allShelves);
      
      // Find shelves that already contain this book
      const bookShelves = BookshelfService.getBookshelvesForBook(bookId);
      setSelectedShelfIds(bookShelves.map(shelf => shelf.id));
      setLoading(false);
    };
    
    loadBookshelves();
  }, [bookId]);
  
  const handleCheckboxChange = (shelfId: string) => {
    // Toggle selection
    if (selectedShelfIds.includes(shelfId)) {
      // Remove book from this shelf
      BookshelfService.removeBookFromShelf(bookId, shelfId);
      setSelectedShelfIds(selectedShelfIds.filter(id => id !== shelfId));
    } else {
      // Add book to this shelf
      BookshelfService.addBookToShelf(bookId, shelfId);
      setSelectedShelfIds([...selectedShelfIds, shelfId]);
    }
  };
  
  const handleAddToAllShelves = () => {
    // Check if the book is already on all shelves
    if (selectedShelfIds.length === bookshelves.length) {
      // Remove from all shelves
      bookshelves.forEach(shelf => {
        BookshelfService.removeBookFromShelf(bookId, shelf.id);
      });
      setSelectedShelfIds([]);
    } else {
      // Add to all shelves
      const allShelfIds = bookshelves.map(shelf => shelf.id);
      allShelfIds.forEach(shelfId => {
        if (!selectedShelfIds.includes(shelfId)) {
          BookshelfService.addBookToShelf(bookId, shelfId);
        }
      });
      setSelectedShelfIds(allShelfIds);
    }
  };
  
  const isBookInAllShelves = bookshelves.length > 0 && selectedShelfIds.length === bookshelves.length;
  
  const handleCreateShelf = () => {
    if (!newShelfName.trim()) return;
    
    // Create new shelf
    const newShelf = BookshelfService.createBookshelf(
      newShelfName.trim(),
      newShelfDescription.trim() || undefined,
      newShelfEmoji.trim() || undefined
    );
    
    // Add book to the new shelf
    BookshelfService.addBookToShelf(bookId, newShelf.id);
    
    // Update state
    setBookshelves([...bookshelves, newShelf]);
    setSelectedShelfIds([...selectedShelfIds, newShelf.id]);
    setIsCreatingNew(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewShelfName('');
    setNewShelfEmoji('');
    setNewShelfDescription('');
  };
  
  return (
    <div className="bookshelf-modal-overlay" onClick={onClose}>
      <div className="bookshelf-modal" onClick={e => e.stopPropagation()}>
        <div className="bookshelf-modal-header">
          <h2>Add to Bookshelf</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="bookshelf-modal-content">
          {loading ? (
            <div className="loading">Loading bookshelves...</div>
          ) : (
            <>
              {bookshelves.length > 0 && (
                <>
                  <div className="add-to-all-option">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={isBookInAllShelves}
                        onChange={handleAddToAllShelves}
                      />
                      <span className="shelf-emoji">🔄</span>
                      <span className="shelf-name"><strong>Add to All Shelves</strong></span>
                    </label>
                  </div>
                  
                  <div className="bookshelf-divider"></div>
                  
                  <div className="bookshelves-list">
                    {bookshelves.map(shelf => (
                      <div key={shelf.id} className="bookshelf-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedShelfIds.includes(shelf.id)}
                            onChange={() => handleCheckboxChange(shelf.id)}
                          />
                          <span className="shelf-emoji">{shelf.emoji || '📚'}</span>
                          <span className="shelf-name">{shelf.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {!isCreatingNew ? (
                <button 
                  className="create-shelf-btn" 
                  onClick={() => setIsCreatingNew(true)}
                >
                  + Create New Bookshelf
                </button>
              ) : (
                <div className="create-shelf-form">
                  <div className="form-group">
                    <label>Shelf Name</label>
                    <input 
                      type="text" 
                      value={newShelfName} 
                      onChange={e => setNewShelfName(e.target.value)}
                      placeholder="e.g., Books That Made Me Cry"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description (optional)</label>
                    <input 
                      type="text" 
                      value={newShelfDescription} 
                      onChange={e => setNewShelfDescription(e.target.value)}
                      placeholder="What kind of books go here?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Emoji (optional)</label>
                    <input 
                      type="text" 
                      value={newShelfEmoji} 
                      onChange={e => setNewShelfEmoji(e.target.value)}
                      placeholder="e.g., 😭"
                      maxLength={2}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="cancel-form-btn" 
                      onClick={() => {
                        setIsCreatingNew(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="save-shelf-btn"
                      onClick={handleCreateShelf}
                      disabled={!newShelfName.trim()}
                    >
                      Create & Add
                    </button>
                  </div>
                </div>
              )}
              
              <div className="modal-footer">
                <button className="done-btn" onClick={onClose}>
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToBookshelfModal; 