import React from 'react';
import { Book } from '../types';
import '../styles/BookList.css';

interface BookListProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  return (
    <div className="book-list">
      {books.map(book => (
        <div 
          key={book.id} 
          className="book-list-item"
          onClick={() => onBookClick && onBookClick(book)}
        >
          <div className="book-cover">
            <img 
              src={book.cover} 
              alt={`${book.title} cover`} 
              loading="lazy"
            />
          </div>
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList; 