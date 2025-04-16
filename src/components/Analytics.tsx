import React, { useState } from 'react';
import '../styles/Analytics.css';

const Analytics: React.FC = () => {
  // State to track active time period for the charts
  const [timePeriod, setTimePeriod] = useState<string>('6months');
  
  // Sample data - would come from Supabase in a real app
  // Library Growth - Books added per month
  const libraryGrowthData = {
    '1month': [
      { month: 'This Month', count: 12 }
    ],
    '3months': [
      { month: 'Mar', count: 8 },
      { month: 'Apr', count: 14 },
      { month: 'May', count: 12 }
    ],
    '6months': [
      { month: 'Dec', count: 5 },
      { month: 'Jan', count: 9 },
      { month: 'Feb', count: 7 },
      { month: 'Mar', count: 8 },
      { month: 'Apr', count: 14 },
      { month: 'May', count: 12 }
    ],
    '1year': [
      { month: 'Jun', count: 4 },
      { month: 'Jul', count: 6 },
      { month: 'Aug', count: 8 },
      { month: 'Sep', count: 11 },
      { month: 'Oct', count: 7 },
      { month: 'Nov', count: 6 },
      { month: 'Dec', count: 5 },
      { month: 'Jan', count: 9 },
      { month: 'Feb', count: 7 },
      { month: 'Mar', count: 8 },
      { month: 'Apr', count: 14 },
      { month: 'May', count: 12 }
    ]
  };

  // Find max value in current period for scaling the chart
  const currentData = libraryGrowthData[timePeriod as keyof typeof libraryGrowthData];
  const maxLibraryCount = Math.max(...currentData.map(item => item.count));
  
  // Community Engagement data
  const communityEngagementData = {
    posts: {
      total: 47,
      thisMonth: 12,
      trend: '+8.5%'
    },
    comments: {
      total: 183,
      thisMonth: 38,
      trend: '+12.3%'
    },
    messages: {
      total: 126,
      thisMonth: 26,
      trend: '+5.2%'
    },
    monthly: [
      { month: 'Dec', posts: 3, comments: 11, messages: 8 },
      { month: 'Jan', posts: 5, comments: 19, messages: 12 },
      { month: 'Feb', posts: 8, comments: 24, messages: 15 },
      { month: 'Mar', posts: 7, comments: 31, messages: 19 },
      { month: 'Apr', posts: 12, comments: 45, messages: 21 },
      { month: 'May', posts: 12, comments: 38, messages: 26 }
    ]
  };

  // Marketplace Performance data
  const marketplaceData = {
    summary: {
      totalListings: 28,
      totalSold: 17,
      sellThroughRate: 60.7,
      avgListPrice: 11.25,
      avgSalePrice: 9.82,
      avgTimeToSell: 8 // days
    },
    categories: [
      { name: 'Fiction', sellThrough: 75, avgPrice: 10.50 },
      { name: 'Non-Fiction', sellThrough: 62, avgPrice: 9.25 },
      { name: 'Sci-Fi', sellThrough: 82, avgPrice: 8.75 },
      { name: 'Mystery', sellThrough: 58, avgPrice: 7.99 },
      { name: 'Biography', sellThrough: 45, avgPrice: 12.50 }
    ],
    monthlySales: [
      { month: 'Dec', sold: 2, revenue: 17.99 },
      { month: 'Jan', sold: 3, revenue: 24.50 },
      { month: 'Feb', sold: 2, revenue: 19.25 },
      { month: 'Mar', sold: 3, revenue: 32.75 },
      { month: 'Apr', sold: 4, revenue: 38.99 },
      { month: 'May', sold: 3, revenue: 33.25 }
    ]
  };

  // Calculate percentage for bar chart scaling
  const calculateBarHeight = (value: number, max: number): number => {
    return (value / max) * 100;
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics & Insights</h1>
        <div className="time-period-selector">
          <label>Time Period:</label>
          <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Library Growth Section */}
        <section className="analytics-section library-growth-section">
          <div className="section-header">
            <h2>Library Growth Over Time</h2>
          </div>
          <div className="chart-container">
            <div className="line-chart">
              <div className="chart-labels">
                <div className="y-axis-label">Books Added</div>
                <div className="x-axis-label">Month</div>
              </div>
              <div className="chart-content">
                <div className="y-axis">
                  {Array.from({ length: 5 }, (_, i) => {
                    const value = Math.ceil(maxLibraryCount * (4 - i) / 4);
                    return <div key={i} className="y-axis-mark">{value}</div>;
                  })}
                  <div className="y-axis-mark">0</div>
                </div>
                <div className="chart-area">
                  {currentData.map((item, index) => (
                    <div key={index} className="data-point">
                      <div 
                        className="bar" 
                        style={{ height: `${calculateBarHeight(item.count, maxLibraryCount)}%` }}
                      >
                        <div className="point-value">{item.count}</div>
                      </div>
                      <div className="x-label">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="library-stats">
            <div className="stat-card">
              <div className="stat-title">Total Books</div>
              <div className="stat-value">
                {currentData.reduce((total, item) => total + item.count, 0)}
              </div>
              <div className="stat-period">{timePeriod === '1month' ? 'This Month' : 'Selected Period'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Monthly Average</div>
              <div className="stat-value">
                {(currentData.reduce((total, item) => total + item.count, 0) / currentData.length).toFixed(1)}
              </div>
              <div className="stat-period">Books per Month</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Growth Rate</div>
              <div className="stat-value">
                {timePeriod !== '1month' && currentData.length > 1 
                  ? ((currentData[currentData.length - 1].count / currentData[0].count - 1) * 100).toFixed(1) + '%'
                  : 'N/A'}
              </div>
              <div className="stat-period">First to Last Month</div>
            </div>
          </div>
        </section>

        {/* Community Engagement Section */}
        <section className="analytics-section engagement-section">
          <div className="section-header">
            <h2>Community Engagement</h2>
          </div>
          
          <div className="engagement-metrics">
            <div className="metric-card">
              <div className="metric-icon">📝</div>
              <div className="metric-details">
                <div className="metric-title">Posts</div>
                <div className="metric-value">{communityEngagementData.posts.total}</div>
                <div className="metric-trend positive">{communityEngagementData.posts.trend}</div>
              </div>
              <div className="metric-subtitle">
                {communityEngagementData.posts.thisMonth} this month
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">💬</div>
              <div className="metric-details">
                <div className="metric-title">Comments</div>
                <div className="metric-value">{communityEngagementData.comments.total}</div>
                <div className="metric-trend positive">{communityEngagementData.comments.trend}</div>
              </div>
              <div className="metric-subtitle">
                {communityEngagementData.comments.thisMonth} this month
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">✉️</div>
              <div className="metric-details">
                <div className="metric-title">Messages</div>
                <div className="metric-value">{communityEngagementData.messages.total}</div>
                <div className="metric-trend positive">{communityEngagementData.messages.trend}</div>
              </div>
              <div className="metric-subtitle">
                {communityEngagementData.messages.thisMonth} this month
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="stacked-chart">
              <div className="chart-title">Monthly Activity Breakdown</div>
              <div className="chart-content">
                {communityEngagementData.monthly.map((month, index) => (
                  <div key={index} className="month-column">
                    <div className="stacked-bar">
                      <div 
                        className="bar-segment posts" 
                        style={{ height: `${month.posts * 4}px` }}
                        title={`${month.posts} posts`}
                      ></div>
                      <div 
                        className="bar-segment comments" 
                        style={{ height: `${month.comments * 4}px` }}
                        title={`${month.comments} comments`}
                      ></div>
                      <div 
                        className="bar-segment messages" 
                        style={{ height: `${month.messages * 4}px` }}
                        title={`${month.messages} messages`}
                      ></div>
                    </div>
                    <div className="month-label">{month.month}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color posts"></div>
                  <div className="legend-label">Posts</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color comments"></div>
                  <div className="legend-label">Comments</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color messages"></div>
                  <div className="legend-label">Messages</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Performance Section */}
        <section className="analytics-section marketplace-section">
          <div className="section-header">
            <h2>Marketplace Performance</h2>
          </div>
          
          <div className="marketplace-summary">
            <div className="summary-card">
              <div className="summary-title">Sell-Through Rate</div>
              <div className="summary-value">{marketplaceData.summary.sellThroughRate}%</div>
              <div className="summary-subtitle">
                {marketplaceData.summary.totalSold} sold out of {marketplaceData.summary.totalListings} listed
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Average Sale Price</div>
              <div className="summary-value">${marketplaceData.summary.avgSalePrice.toFixed(2)}</div>
              <div className="summary-subtitle">
                vs. ${marketplaceData.summary.avgListPrice.toFixed(2)} average list price
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Average Time to Sell</div>
              <div className="summary-value">{marketplaceData.summary.avgTimeToSell} days</div>
              <div className="summary-subtitle">
                from listing to sold status
              </div>
            </div>
          </div>

          <div className="marketplace-analysis">
            <div className="category-performance">
              <h3>Performance by Category</h3>
              <div className="categories-chart">
                {marketplaceData.categories.map((category, index) => (
                  <div key={index} className="category-row">
                    <div className="category-name">{category.name}</div>
                    <div className="category-metrics">
                      <div className="sell-through-bar">
                        <div 
                          className="fill-bar" 
                          style={{ width: `${category.sellThrough}%` }}
                        ></div>
                        <div className="bar-label">{category.sellThrough}% sell-through</div>
                      </div>
                      <div className="avg-price">${category.avgPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="monthly-sales">
              <h3>Monthly Sales & Revenue</h3>
              <div className="sales-chart">
                {marketplaceData.monthlySales.map((month, index) => (
                  <div key={index} className="month-sales">
                    <div className="month-label">{month.month}</div>
                    <div className="sales-data">
                      <div className="books-sold">{month.sold} books</div>
                      <div className="sales-revenue">${month.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics; 