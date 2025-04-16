import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validResetLink, setValidResetLink] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has a valid reset token
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setValidResetLink(true);
      }
    };
    
    checkSession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password has been reset successfully!');
        // Clear form
        setPassword('');
        setConfirmPassword('');
        // Redirect after a short delay
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Password update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // If no valid reset token is found
  if (!validResetLink) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form-wrapper">
          <div className="error-message">
            Invalid or expired password reset link. Please try requesting a new password reset.
          </div>
          <div className="back-to-login">
            <button 
              className="login-button" 
              onClick={() => navigate('/forgot-password')}
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-form-wrapper">
        <h2>Set New Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handlePasswordReset} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
            <small className="password-hint">Password must be at least 8 characters long</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button" 
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 