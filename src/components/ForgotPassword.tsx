import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          'Password reset instructions sent! Please check your email.'
        );
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form-wrapper">
        <h2>Reset Your Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleResetPassword} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <p className="input-description">
              Enter the email address you used to register. We'll send you instructions to reset your password.
            </p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button" 
            disabled={loading}
          >
            {loading ? 'Sending Instructions...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="back-to-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 