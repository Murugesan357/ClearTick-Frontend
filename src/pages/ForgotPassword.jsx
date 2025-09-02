import { useState } from 'react';
import '../styles/ForgotPassword.css';
import { sendMail, verifyOtp, updatePassword } from '../utils/api';

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setStatus('Please enter your email.');
      return;
    }
    setStatus('Sending...');
    try {
      const res = await sendMail(email);
      if (!res.success ) throw new Error('Failed to send OTP');
      setStatus('OTP sent successfully! Check your email.');
      setStep(2);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setStatus('Please enter OTP.');
      return;
    }
    setStatus('Verifying...');
    try {
      const res = await verifyOtp({ email, otp });
      if (!res.isVerified) throw new Error('Invalid OTP');
      setStatus('OTP verified! Please set a new password.');
      setStep(3);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      setStatus('Please enter a new password.');
      return;
    }
    setStatus('Updating...');
    try {
      const res = await updatePassword({ email, newPassword });
      if (!res.success) throw new Error('Failed to update password');
      setStatus('Password updated successfully! You can now log in.');
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h3>Forgot Password</h3>
        {status && <p className="status-text">{status}</p>}

        {/* get email input step */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-success" onClick={handleSendOtp}>Send OTP</button>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {/* OTP entering window */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="form-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-success" onClick={handleVerifyOtp}>Verify OTP</button>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {/* New password entering window */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-success" onClick={handleUpdatePassword}>Update Password</button>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
