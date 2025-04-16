import React, { useState } from 'react';
import '../styles/Marketplace.css';

const Marketplace: React.FC = () => {
  // State for active tab in My Listings section
  const [activeListingsTab, setActiveListingsTab] = useState<string>('available');
  
  // Sample data - would come from Supabase in a real app
  const myListings = {
    available: [
      {
        id: 1,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        condition: 'Like New',
        price: 12.99,
        posted: '3 days ago',
        image: '/books/midnight-library.jpg',
        views: 24,
        savedBy: 5
      },
      {
        id: 2,
        title: 'Educated',
        author: 'Tara Westover',
        condition: 'Good',
        price: 8.50,
        posted: '1 week ago',
        image: '/books/educated.jpg',
        views: 37,
        savedBy: 12
      }
    ],
    reserved: [
      {
        id: 3,
        title: 'Atomic Habits',
        author: 'James Clear',
        condition: 'Excellent',
        price: 10.99,
        posted: '5 days ago',
        reservedBy: 'Sarah Johnson',
        reservedDate: '1 day ago',
        image: '/books/atomic-habits.jpg'
      }
    ],
    sold: [
      {
        id: 4,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        condition: 'Good',
        price: 9.99,
        soldDate: '2 days ago',
        soldTo: 'Michael Rodriguez',
        image: '/books/sapiens.jpg'
      },
      {
        id: 5,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        condition: 'Acceptable',
        price: 5.99,
        soldDate: '1 week ago',
        soldTo: 'Emily Wilson',
        image: '/books/great-gatsby.jpg'
      }
    ]
  };

  const incomingOffers = [
    {
      id: 1,
      bookTitle: 'The Midnight Library',
      originalPrice: 12.99,
      offerPrice: 10.50,
      offeredBy: 'David Chen',
      message: 'Would you accept $10.50? The book looks great and I can pick it up tomorrow.',
      offerDate: '12 hours ago',
      buyerRating: 4.8
    },
    {
      id: 2,
      bookTitle: 'Educated',
      originalPrice: 8.50,
      offerPrice: 7.00,
      offeredBy: 'Lisa Martinez',
      message: "Hi! I'm interested in your book. Would you take $7?",
      offerDate: '1 day ago',
      buyerRating: 4.5
    }
  ];

  const pendingPurchases = [
    {
      id: 1,
      bookTitle: 'Project Hail Mary',
      author: 'Andy Weir',
      seller: 'Thomas Wright',
      price: 11.99,
      offerStatus: 'Accepted',
      nextStep: 'Arrange Pickup',
      requestDate: '2 days ago',
      image: '/books/project-hail-mary.jpg'
    },
    {
      id: 2,
      bookTitle: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      seller: 'Jessica Kim',
      price: 13.50,
      offerStatus: 'Pending',
      nextStep: 'Waiting for response',
      requestDate: '1 day ago',
      image: '/books/klara-sun.jpg'
    }
  ];

  const recommendedBooks = [
    {
      id: 1,
      title: 'Cloud Cuckoo Land',
      author: 'Anthony Doerr',
      price: 14.99,
      condition: 'Like New',
      seller: 'Robert Johnson',
      sellerRating: 4.9,
      location: '0.8 miles away',
      postedDate: '2 days ago',
      image: '/books/cloud-cuckoo.jpg',
      match: 'Based on your reading history'
    },
    {
      id: 2,
      title: 'The Lincoln Highway',
      author: 'Amor Towles',
      price: 13.25,
      condition: 'Excellent',
      seller: 'Amanda Garcia',
      sellerRating: 4.7,
      location: '1.2 miles away',
      postedDate: '3 days ago',
      image: '/books/lincoln-highway.jpg',
      match: 'You follow this author'
    },
    {
      id: 3,
      title: 'The Dutch House',
      author: 'Ann Patchett',
      price: 9.99,
      condition: 'Good',
      seller: 'Daniel Wilson',
      sellerRating: 4.8,
      location: '2.5 miles away',
      postedDate: '1 day ago',
      image: '/books/dutch-house.jpg',
      match: 'Others in "Contemporary Fiction" club bought this'
    }
  ];

  const hotDeals = [
    {
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      originalPrice: 10.99,
      salePrice: 5.50,
      discount: '50% off',
      condition: 'Good',
      seller: 'Christine Taylor',
      postedDate: 'Today',
      image: '/books/mockingbird.jpg'
    },
    {
      id: 2,
      title: 'Dune',
      author: 'Frank Herbert',
      originalPrice: 12.99,
      salePrice: 7.99,
      discount: '38% off',
      condition: 'Excellent',
      seller: 'Mark Williams',
      postedDate: 'Yesterday',
      image: '/books/dune.jpg'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'sold',
      bookTitle: 'Sapiens',
      price: 9.99,
      date: 'May 15, 2023',
      otherParty: 'Michael Rodriguez',
      status: 'Completed'
    },
    {
      id: 2,
      type: 'sold',
      bookTitle: 'The Great Gatsby',
      price: 5.99,
      date: 'May 10, 2023',
      otherParty: 'Emily Wilson',
      status: 'Completed'
    },
    {
      id: 3,
      type: 'purchase',
      bookTitle: 'The Alchemist',
      price: 8.50,
      date: 'May 8, 2023',
      otherParty: 'James Peterson',
      status: 'Completed'
    },
    {
      id: 4,
      type: 'purchase',
      bookTitle: '1984',
      price: 7.25,
      date: 'May 2, 2023',
      otherParty: 'Sophia Lee',
      status: 'Completed'
    }
  ];

  // Calculate earnings and spending totals
  const financialSummary = {
    earnings: recentTransactions
      .filter(transaction => transaction.type === 'sold')
      .reduce((total, transaction) => total + transaction.price, 0),
    spending: recentTransactions
      .filter(transaction => transaction.type === 'purchase')
      .reduce((total, transaction) => total + transaction.price, 0)
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h1>Book Marketplace</h1>
        <div className="marketplace-controls">
          <div className="search-box">
            <input type="text" placeholder="Search books, authors..." />
            <button><span>🔍</span></button>
          </div>
          <button className="sell-book-btn">+ Sell a Book</button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="marketplace-grid">
        {/* Left Column */}
        <div className="marketplace-column main-column">
          {/* My Listings Section */}
          <section className="my-listings-section">
            <div className="section-header with-tabs">
              <h2>My Listings</h2>
              <div className="section-tabs">
                <button 
                  className={activeListingsTab === 'available' ? 'active' : ''} 
                  onClick={() => setActiveListingsTab('available')}
                >
                  Available ({myListings.available.length})
                </button>
                <button 
                  className={activeListingsTab === 'reserved' ? 'active' : ''} 
                  onClick={() => setActiveListingsTab('reserved')}
                >
                  Reserved ({myListings.reserved.length})
                </button>
                <button 
                  className={activeListingsTab === 'sold' ? 'active' : ''} 
                  onClick={() => setActiveListingsTab('sold')}
                >
                  Sold ({myListings.sold.length})
                </button>
              </div>
            </div>

            <div className="listings-container">
              {activeListingsTab === 'available' && (
                <div className="listings-grid">
                  {myListings.available.map(listing => (
                    <div key={listing.id} className="listing-card">
                      <div className="listing-status available">Available</div>
                      <div className="listing-image" style={{ backgroundColor: '#e2e8f0' }}></div>
                      <div className="listing-details">
                        <h3 className="book-title">{listing.title}</h3>
                        <p className="book-author">by {listing.author}</p>
                        <div className="listing-meta">
                          <span className="book-condition">{listing.condition}</span>
                          <span className="listing-price">${listing.price.toFixed(2)}</span>
                        </div>
                        <div className="listing-stats">
                          <span className="views">{listing.views} views</span>
                          <span className="saved">{listing.savedBy} saved</span>
                          <span className="posted">{listing.posted}</span>
                        </div>
                      </div>
                      <div className="listing-actions">
                        <button className="edit-listing-btn">Edit</button>
                        <button className="remove-listing-btn">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeListingsTab === 'reserved' && (
                <div className="listings-grid">
                  {myListings.reserved.map(listing => (
                    <div key={listing.id} className="listing-card">
                      <div className="listing-status reserved">Reserved</div>
                      <div className="listing-image" style={{ backgroundColor: '#e2e8f0' }}></div>
                      <div className="listing-details">
                        <h3 className="book-title">{listing.title}</h3>
                        <p className="book-author">by {listing.author}</p>
                        <div className="listing-meta">
                          <span className="book-condition">{listing.condition}</span>
                          <span className="listing-price">${listing.price.toFixed(2)}</span>
                        </div>
                        <div className="reservation-info">
                          <p>Reserved by <strong>{listing.reservedBy}</strong></p>
                          <p className="reservation-date">{listing.reservedDate}</p>
                        </div>
                      </div>
                      <div className="listing-actions">
                        <button className="mark-sold-btn">Mark as Sold</button>
                        <button className="cancel-reservation-btn">Cancel Reservation</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeListingsTab === 'sold' && (
                <div className="listings-grid">
                  {myListings.sold.map(listing => (
                    <div key={listing.id} className="listing-card">
                      <div className="listing-status sold">Sold</div>
                      <div className="listing-image" style={{ backgroundColor: '#e2e8f0' }}></div>
                      <div className="listing-details">
                        <h3 className="book-title">{listing.title}</h3>
                        <p className="book-author">by {listing.author}</p>
                        <div className="listing-meta">
                          <span className="book-condition">{listing.condition}</span>
                          <span className="listing-price">${listing.price.toFixed(2)}</span>
                        </div>
                        <div className="sale-info">
                          <p>Sold to <strong>{listing.soldTo}</strong></p>
                          <p className="sale-date">{listing.soldDate}</p>
                        </div>
                      </div>
                      <div className="listing-actions">
                        <button className="relist-btn">Relist Similar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeListingsTab === 'available' && myListings.available.length === 0 && (
                <div className="empty-state">
                  <p>You don't have any available listings.</p>
                  <button className="create-listing-btn">Create Your First Listing</button>
                </div>
              )}

              {activeListingsTab === 'reserved' && myListings.reserved.length === 0 && (
                <div className="empty-state">
                  <p>You don't have any reserved books.</p>
                </div>
              )}

              {activeListingsTab === 'sold' && myListings.sold.length === 0 && (
                <div className="empty-state">
                  <p>You haven't sold any books yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Offers & Requests Section */}
          <section className="offers-requests-section">
            <div className="section-header">
              <h2>Buy Requests & Offers</h2>
            </div>

            <div className="offers-requests-container">
              {/* Incoming Offers */}
              <div className="offers-container">
                <h3>Incoming Offers</h3>
                {incomingOffers.length > 0 ? (
                  <div className="offers-list">
                    {incomingOffers.map(offer => (
                      <div key={offer.id} className="offer-card">
                        <div className="offer-header">
                          <h4>Offer for "{offer.bookTitle}"</h4>
                          <div className="offer-date">{offer.offerDate}</div>
                        </div>
                        <div className="offer-details">
                          <div className="offer-prices">
                            <div className="original-price">Listed: ${offer.originalPrice.toFixed(2)}</div>
                            <div className="offer-price">Offer: ${offer.offerPrice.toFixed(2)}</div>
                            <div className="price-difference">
                              Difference: ${(offer.originalPrice - offer.offerPrice).toFixed(2)}
                            </div>
                          </div>
                          <div className="offer-buyer">
                            <p className="buyer-name">From: {offer.offeredBy}</p>
                            <p className="buyer-rating">Rating: {offer.buyerRating}/5</p>
                          </div>
                        </div>
                        <div className="offer-message">
                          <p>"{offer.message}"</p>
                        </div>
                        <div className="offer-actions">
                          <button className="accept-offer-btn">Accept</button>
                          <button className="counter-offer-btn">Counter</button>
                          <button className="decline-offer-btn">Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No incoming offers at the moment.</p>
                  </div>
                )}
              </div>

              {/* Pending Purchase Requests */}
              <div className="requests-container">
                <h3>Your Pending Purchase Requests</h3>
                {pendingPurchases.length > 0 ? (
                  <div className="requests-list">
                    {pendingPurchases.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-image" style={{ backgroundColor: '#e2e8f0' }}></div>
                        <div className="request-details">
                          <h4>{request.bookTitle}</h4>
                          <p className="book-author">by {request.author}</p>
                          <div className="request-meta">
                            <div className="request-seller">
                              <span>Seller: {request.seller}</span>
                            </div>
                            <div className="request-price">${request.price.toFixed(2)}</div>
                          </div>
                          <div className="request-status">
                            <span className={`status-badge ${request.offerStatus.toLowerCase()}`}>
                              {request.offerStatus}
                            </span>
                            <span className="next-step">{request.nextStep}</span>
                          </div>
                          <div className="request-date">Requested {request.requestDate}</div>
                        </div>
                        <div className="request-actions">
                          <button className="message-seller-btn">Message Seller</button>
                          {request.offerStatus === 'Accepted' && (
                            <button className="arrange-pickup-btn">Arrange Pickup</button>
                          )}
                          <button className="cancel-request-btn">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You don't have any pending purchase requests.</p>
                    <button className="browse-books-btn">Browse Books</button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="marketplace-column sidebar-column">
          {/* Marketplace Spotlight */}
          <section className="spotlight-section">
            <div className="section-header">
              <h2>Marketplace Spotlight</h2>
            </div>

            {/* Recommended Books */}
            <div className="recommended-books">
              <h3>Recommended for You</h3>
              <div className="book-recommendations">
                {recommendedBooks.map(book => (
                  <div key={book.id} className="recommended-book-card">
                    <div className="book-image" style={{ backgroundColor: '#e2e8f0' }}></div>
                    <div className="book-details">
                      <div className="match-reason">{book.match}</div>
                      <h4 className="book-title">{book.title}</h4>
                      <p className="book-author">by {book.author}</p>
                      <div className="book-meta">
                        <span className="book-condition">{book.condition}</span>
                        <span className="book-price">${book.price.toFixed(2)}</span>
                      </div>
                      <div className="seller-info">
                        <span className="seller-name">{book.seller}</span>
                        <span className="seller-rating">{book.sellerRating}/5</span>
                      </div>
                      <div className="book-location">
                        <span className="location-icon">📍</span>
                        <span>{book.location}</span>
                        <span className="posted-date">{book.postedDate}</span>
                      </div>
                    </div>
                    <div className="book-actions">
                      <button className="view-book-btn">View Book</button>
                      <button className="save-book-btn">Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Deals */}
            <div className="hot-deals">
              <h3>Hot Deals</h3>
              <div className="deals-container">
                {hotDeals.map(deal => (
                  <div key={deal.id} className="deal-card">
                    <div className="discount-badge">{deal.discount}</div>
                    <div className="deal-image" style={{ backgroundColor: '#e2e8f0' }}></div>
                    <div className="deal-details">
                      <h4 className="book-title">{deal.title}</h4>
                      <p className="book-author">by {deal.author}</p>
                      <div className="price-comparison">
                        <span className="original-price">${deal.originalPrice.toFixed(2)}</span>
                        <span className="sale-price">${deal.salePrice.toFixed(2)}</span>
                      </div>
                      <div className="deal-meta">
                        <span className="book-condition">{deal.condition}</span>
                        <span className="seller-name">Seller: {deal.seller}</span>
                        <span className="posted-date">{deal.postedDate}</span>
                      </div>
                    </div>
                    <div className="deal-actions">
                      <button className="view-deal-btn">View Deal</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Transaction Summary */}
          <section className="transactions-section">
            <div className="section-header">
              <h2>Transaction Summary</h2>
            </div>

            <div className="financial-summary">
              <div className="summary-card earnings">
                <div className="summary-label">Total Earnings</div>
                <div className="summary-amount">${financialSummary.earnings.toFixed(2)}</div>
              </div>
              <div className="summary-card spending">
                <div className="summary-label">Total Spending</div>
                <div className="summary-amount">${financialSummary.spending.toFixed(2)}</div>
              </div>
              <div className="summary-card balance">
                <div className="summary-label">Net Balance</div>
                <div className="summary-amount">${(financialSummary.earnings - financialSummary.spending).toFixed(2)}</div>
              </div>
            </div>

            <div className="recent-transactions">
              <h3>Recent Transactions</h3>
              <div className="transactions-list">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-icon">
                      {transaction.type === 'sold' ? '📤' : '📥'}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-header">
                        <span className="transaction-title">
                          {transaction.type === 'sold' ? 'Sold' : 'Purchased'}: {transaction.bookTitle}
                        </span>
                        <span className="transaction-amount">${transaction.price.toFixed(2)}</span>
                      </div>
                      <div className="transaction-meta">
                        <span className="transaction-date">{transaction.date}</span>
                        <span className="transaction-party">
                          {transaction.type === 'sold' ? 'Buyer' : 'Seller'}: {transaction.otherParty}
                        </span>
                      </div>
                      <div className="transaction-status">{transaction.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-transactions">View All Transactions</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Marketplace; 