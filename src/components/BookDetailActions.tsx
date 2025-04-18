import React, { useState } from 'react';
import { Book } from '../types';
import AddToBookshelfModal from './AddToBookshelfModal';
import '../styles/BookDetailActions.css';

interface BookDetailActionsProps {
  book: Book;
}

const BookDetailActions: React.FC<BookDetailActionsProps> = ({ book }) => {
  const [showBookshelfModal, setShowBookshelfModal] = useState(false);
  
  return (
    <div className="book-detail-actions">
      <button 
        className="add-to-bookshelf-btn"
        onClick={() => setShowBookshelfModal(true)}
      >
        <span className="btn-icon">📚</span>
        Add to Bookshelf
      </button>
      
      {showBookshelfModal && (
        <AddToBookshelfModal 
          bookId={book.id} 
          onClose={() => setShowBookshelfModal(false)} 
        />
      )}
    </div>
  );
};

export default BookDetailActions; 