import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import ForgotPassword from './ForgotPassword';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/global.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);

  const navigate = useNavigate();

  // Slideshow images and slogans
  const slides = [
    { image: '/home_1.png', slogan: 'Organize your day, the ClearTick way!' },
    { image: '/home_2.png', slogan: 'Every tick brings you closer to done.' },
    { image: '/home_3.png', slogan: 'Plan smart. Tick fast. Live free.' }
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % slides.length;
        setAnimateKey(Date.now());
        return newIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const authtoken = localStorage.getItem('authtoken');
    if (authtoken) {
      navigate('/todos');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await loginUser(email, password);
      localStorage.setItem('authtoken', response?.accessToken);
      localStorage.setItem('user', response?.user ? JSON.stringify(response.user) : '');
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/todos');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left section */}
      <div className="login-left">
        <div className="brand">
          <img src="/todo_app_logo.png" alt="logo" className="app-logo" />
          <h1 className="app-name">ClearTick</h1>
        </div>
        <div className="slideshow">
          <img
            src={slides[currentSlideIndex].image}
            alt="Login Illustration"
            className="login-image"
          />
          {/* key prop ensures animation restarts */}
          <p key={animateKey} className="slide-slogan">{slides[currentSlideIndex].slogan}</p>
        </div>
      </div>

      {/* Right section */}
      <div className="login-right">
        <div className="form-container">
          <h2 className="text-center mb-4">Welcome Back</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-icon"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* Forgot Password Button */}
            <div className="forgot-password-link">
              <button
                type="button"
                className="btn-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-login mb-4 btn-fullwidth"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-link">Sign up here</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPassword onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
};

export default Login;
