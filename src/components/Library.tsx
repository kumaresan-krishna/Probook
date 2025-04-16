import React, { useState } from 'react';
import '../styles/Library.css';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: 'reading' | 'completed' | 'want-to-read' | 'dnf';
  readingProgress?: number;
  lastOpened?: string;
  dateAdded: string;
  genre: string[];
  format: 'physical' | 'ebook' | 'audiobook';
}

const Library: React.FC = () => {
  // State for selected filters
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeGenre, setActiveGenre] = useState<string>('all');
  const [activeFormat, setActiveFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateAdded');
  
  // Sample book data
  const allBooks: Book[] = [
    // Currently Reading Books
    {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81tCtHFtOgL.jpg',
      status: 'reading',
      readingProgress: 45,
      lastOpened: '2023-04-10',
      dateAdded: '2023-03-15',
      genre: ['Fiction', 'Fantasy'],
      format: 'ebook'
    },
    {
      id: '4',
      title: 'The Song of Achilles',
      author: 'Madeline Miller',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71QMkXclVlL.jpg',
      status: 'reading',
      readingProgress: 75,
      lastOpened: '2023-04-12',
      dateAdded: '2023-01-30',
      genre: ['Historical Fiction', 'Fantasy'],
      format: 'physical'
    },
    {
      id: '8',
      title: 'The Invisible Life of Addie LaRue',
      author: 'V.E. Schwab',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/91HiotFsYAL.jpg',
      status: 'reading',
      readingProgress: 30,
      lastOpened: '2023-04-11',
      dateAdded: '2023-02-05',
      genre: ['Fantasy', 'Historical Fiction'],
      format: 'physical'
    },
    {
      id: '14',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg',
      status: 'reading',
      readingProgress: 60,
      lastOpened: '2023-04-08',
      dateAdded: '2023-03-01',
      genre: ['Classic', 'Fiction'],
      format: 'ebook'
    },
    {
      id: '16',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71pQQ9w8P9L.jpg',
      status: 'reading',
      readingProgress: 15,
      lastOpened: '2023-04-15',
      dateAdded: '2023-04-01',
      genre: ['Historical Fiction', 'Romance'],
      format: 'ebook'
    },
    {
      id: '17',
      title: 'Tomorrow, and Tomorrow, and Tomorrow',
      author: 'Gabrielle Zevin',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71B3xhGJwLL.jpg',
      status: 'reading',
      readingProgress: 35,
      lastOpened: '2023-04-14',
      dateAdded: '2023-03-25',
      genre: ['Fiction', 'Contemporary'],
      format: 'physical'
    },
    
    // Completed Books
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg',
      status: 'completed',
      dateAdded: '2023-02-20',
      genre: ['Self-Help', 'Psychology'],
      format: 'physical'
    },
    {
      id: '5',
      title: 'Educated',
      author: 'Tara Westover',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81NwOj14S6L.jpg',
      status: 'completed',
      dateAdded: '2022-11-10',
      genre: ['Memoir', 'Biography'],
      format: 'audiobook'
    },
    {
      id: '10',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
      status: 'completed',
      dateAdded: '2022-08-05',
      genre: ['Fiction', 'Philosophy'],
      format: 'physical'
    },
    {
      id: '12',
      title: '1984',
      author: 'George Orwell',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
      status: 'completed',
      dateAdded: '2022-06-15',
      genre: ['Dystopian', 'Classic'],
      format: 'physical'
    },
    {
      id: '13',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg',
      status: 'completed',
      dateAdded: '2022-07-30',
      genre: ['Classic', 'Fiction'],
      format: 'physical'
    },
    {
      id: '18',
      title: 'The Kite Runner',
      author: 'Khaled Hosseini',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81IzbD2IiIL.jpg',
      status: 'completed',
      dateAdded: '2022-05-18',
      genre: ['Historical Fiction', 'Drama'],
      format: 'audiobook'
    },
    {
      id: '19',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81hyskAUFmL.jpg',
      status: 'completed',
      dateAdded: '2022-12-10',
      genre: ['Thriller', 'Mystery'],
      format: 'ebook'
    },
    
    // Want to Read Books
    {
      id: '3',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81wOzMdEUgL.jpg',
      status: 'want-to-read',
      dateAdded: '2023-04-05',
      genre: ['Science Fiction', 'Adventure'],
      format: 'ebook'
    },
    {
      id: '6',
      title: 'The House in the Cerulean Sea',
      author: 'TJ Klune',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71p1FEPEAKL.jpg',
      status: 'want-to-read',
      dateAdded: '2023-03-28',
      genre: ['Fantasy', 'LGBTQ+'],
      format: 'ebook'
    },
    {
      id: '9',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71NIeuI+3gL.jpg',
      status: 'want-to-read',
      dateAdded: '2023-01-15',
      genre: ['Finance', 'Psychology'],
      format: 'ebook'
    },
    {
      id: '11',
      title: 'Dune',
      author: 'Frank Herbert',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81wr3zp3VyL.jpg',
      status: 'want-to-read',
      dateAdded: '2023-02-10',
      genre: ['Science Fiction', 'Classic'],
      format: 'ebook'
    },
    {
      id: '15',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71yNgTMEcDL.jpg',
      status: 'want-to-read',
      dateAdded: '2023-01-20',
      genre: ['History', 'Science'],
      format: 'audiobook'
    },
    {
      id: '20',
      title: 'Cloud Cuckoo Land',
      author: 'Anthony Doerr',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/91HHxxtA1wL.jpg',
      status: 'want-to-read',
      dateAdded: '2023-03-10',
      genre: ['Historical Fiction', 'Science Fiction'],
      format: 'physical'
    },
    {
      id: '21',
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81nbBmfLEML.jpg',
      status: 'want-to-read',
      dateAdded: '2023-02-22',
      genre: ['Science Fiction', 'Dystopian'],
      format: 'physical'
    },
    
    // Did Not Finish Books
    {
      id: '7',
      title: 'Circe',
      author: 'Madeline Miller',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71FQbGLrwZL.jpg',
      status: 'dnf',
      dateAdded: '2022-09-15',
      genre: ['Fantasy', 'Mythology'],
      format: 'physical'
    },
    {
      id: '22',
      title: 'Ulysses',
      author: 'James Joyce',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71GvdS-TW6L.jpg',
      status: 'dnf',
      dateAdded: '2022-10-15',
      genre: ['Classic', 'Modernist'],
      format: 'physical'
    },
    {
      id: '23',
      title: 'Atlas Shrugged',
      author: 'Ayn Rand',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71x2rH5aC0L.jpg',
      status: 'dnf',
      dateAdded: '2022-08-20',
      genre: ['Philosophy', 'Fiction'],
      format: 'physical'
    },
    {
      id: '24',
      title: 'Infinite Jest',
      author: 'David Foster Wallace',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71IWwob4bML.jpg',
      status: 'dnf',
      dateAdded: '2022-04-10',
      genre: ['Postmodern', 'Literary Fiction'],
      format: 'ebook'
    },
    {
      id: '25',
      title: 'Crime and Punishment',
      author: 'Fyodor Dostoevsky',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81Y8IM-hU8L.jpg',
      status: 'dnf',
      dateAdded: '2022-06-02',
      genre: ['Classic', 'Philosophical Fiction'],
      format: 'physical'
    }
  ];

  // Filter books based on selected filters
  const filteredBooks = allBooks.filter(book => {
    // Filter by status
    if (activeFilter !== 'all' && book.status !== activeFilter) {
      return false;
    }
    
    // Filter by genre
    if (activeGenre !== 'all' && !book.genre.includes(activeGenre)) {
      return false;
    }
    
    // Filter by format
    if (activeFormat !== 'all' && book.format !== activeFormat) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !book.author.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort books based on selected sort option
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    } else if (sortBy === 'dateAdded') {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    return 0;
  });

  // Unique genres from all books
  const allGenres = Array.from(new Set(allBooks.flatMap(book => book.genre)));
  
  return (
    <div className="library-container">
      <div className="library-header">
        <h1>My Library</h1>
        <div className="library-actions">
          <button className="add-book-btn">
            <i className="fas fa-plus"></i> Add Book
          </button>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
        </div>
      </div>
      
      <div className="status-tabs">
        <button 
          className={activeFilter === 'all' ? 'active' : ''} 
          onClick={() => setActiveFilter('all')}
        >
          All Books
        </button>
        <button 
          className={activeFilter === 'reading' ? 'active' : ''} 
          onClick={() => setActiveFilter('reading')}
        >
          Currently Reading
        </button>
        <button 
          className={activeFilter === 'completed' ? 'active' : ''} 
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={activeFilter === 'want-to-read' ? 'active' : ''} 
          onClick={() => setActiveFilter('want-to-read')}
        >
          Want to Read
        </button>
        <button 
          className={activeFilter === 'dnf' ? 'active' : ''} 
          onClick={() => setActiveFilter('dnf')}
        >
          Did Not Finish
        </button>
      </div>
      
      <div className="filter-sort-container">
        <div className="filter-container">
          <label>Genre:</label>
          <select 
            value={activeGenre} 
            onChange={(e) => setActiveGenre(e.target.value)}
          >
            <option value="all">All Genres</option>
            {allGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-container">
          <label>Format:</label>
          <select 
            value={activeFormat} 
            onChange={(e) => setActiveFormat(e.target.value)}
          >
            <option value="all">All Formats</option>
            <option value="physical">Physical</option>
            <option value="ebook">E-Book</option>
            <option value="audiobook">Audiobook</option>
          </select>
        </div>
        
        <div className="filter-container">
          <label>Sort By:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dateAdded">Date Added</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover" style={{ backgroundImage: `url(${book.cover})` }}></div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <span className={`book-status ${book.status}`}>
                  {book.status === 'reading' && 'Currently Reading'}
                  {book.status === 'completed' && 'Completed'}
                  {book.status === 'want-to-read' && 'Want to Read'}
                  {book.status === 'dnf' && 'Did Not Finish'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-library">
          <i className="fas fa-book empty-icon"></i>
          <h3>Your book collection will appear here</h3>
          <p>This section would typically display your books with filters and sorting options</p>
          <button className="add-book-btn">Add Your First Book</button>
        </div>
      )}
    </div>
  );
};

export default Library; 