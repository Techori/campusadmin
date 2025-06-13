import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const role = params.get('role');
    const error = params.get('error');

    if (error) {
      // Handle error case
      navigate('/login', { state: { error: 'No account found with this email' } });
      return;
    }

    if (type && role) {
      // Store user type and role
      localStorage.setItem('userType', type);
      localStorage.setItem('userRole', role);

      // Redirect based on user type
      switch (type) {
        case 'company':
          navigate('/company/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'college':
          navigate('/college/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#F3F4F6'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#1F2937' }}>Completing sign in...</h2>
        <p style={{ color: '#6B7280' }}>Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 