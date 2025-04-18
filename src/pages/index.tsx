import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Layout from '../components/Layout';
import ChallengesPage from './ChallengesPage';

// Create temporary placeholder components for missing pages
const HomePage = () => <div>Home Page</div>;
const BooksPage = () => <div>Books Page</div>;
const BookDetailsPage = () => <div>Book Details Page</div>;

// Create a basic theme since the import seems to be failing
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80cbff',
      300: '#4db5ff',
      400: '#1aa0ff',
      500: '#0080e6',
      600: '#0066b3',
      700: '#004d80',
      800: '#00334d',
      900: '#001a1a',
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailsPage />} />
            <Route path="/challenges" element={<ChallengesPage books={[]} />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

export default App; 