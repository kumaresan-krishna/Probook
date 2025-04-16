import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Library from './components/Library';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { supabase } from './lib/supabase';
import './App.css';
import Community from './components/Community';
import Marketplace from './components/Marketplace';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ContextSidebar from './components/ContextSidebar';
import DashboardHome from './components/DashboardHome';
import Clubs from './components/Clubs';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [contextSidebarOpen, setContextSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if we have a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle context sidebar
  const toggleContextSidebar = () => {
    // Force a state update to ensure React captures the change
    setContextSidebarOpen(prevState => !prevState);
  };

  // Explicitly close the context sidebar
  const closeContextSidebar = () => {
    setContextSidebarOpen(false);
  };

  // Protected route component
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div>Loading...</div>;
    return session ? <>{children}</> : <Navigate to="/login" />;
  };

  // Function to render the active page content based on navigation
  const renderAppContent = () => {
    switch(activePage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'books':
        return <Library />;
      case 'community':
        return <Community />;
      case 'clubs':
        return <Clubs />;
      case 'marketplace':
        return <Marketplace />;
      case 'bookbot':
        return (
          <div className="page-container">
            <h1>AI Book Bot</h1>
            <p>The AI Book Bot assistant will be displayed here.</p>
          </div>
        );
      case 'writer':
        return (
          <div className="page-container">
            <h1>Writer.ai</h1>
            <p>The Writer.ai interface will be displayed here.</p>
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'help':
        return (
          <div className="page-container">
            <h1>Help & Support</h1>
            <p>Support resources and documentation will be displayed here.</p>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  // Main application with navigation when authenticated
  const AuthenticatedApp = () => (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="main-content">
          {renderAppContent()}
        </main>
        <ContextSidebar
          activePage={activePage}
          isOpen={contextSidebarOpen}
          toggleSidebar={toggleContextSidebar}
        />
      </div>
      {/* Mobile Menu Toggle Button - Only visible on small screens */}
      <button 
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {/* Context Sidebar Toggle Button */}
      <button 
        className={`context-menu-toggle ${contextSidebarOpen ? 'active' : ''}`}
        onClick={toggleContextSidebar}
        aria-label="Toggle context sidebar"
        type="button"
      >
        <span>{contextSidebarOpen ? '✕' : '⚙️'}</span>
      </button>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/register" element={
          session ? <Navigate to="/dashboard" /> : <Register />
        } />
        <Route path="/login" element={
          session ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/forgot-password" element={
          session ? <Navigate to="/dashboard" /> : <ForgotPassword />
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AuthenticatedApp />
          </PrivateRoute>
        } />
        <Route path="/library" element={
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        } />
        <Route path="/clubs" element={
          <PrivateRoute>
            <Clubs />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App; 