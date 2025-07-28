import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, updatePassword } from '../utils/api';
import Header from '../components/Header';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile(user?.id);
      setProfile(data || {});
      setFormData({
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        email: data?.email || '',
        bio: data?.bio || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await updateProfile(formData, user.id);
      setProfile(data);
      localStorage.setItem('user', data ? JSON.stringify(data) : '');
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      bio: profile.bio || ''
    });
    setEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await updatePassword(user.email, passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="container">
            <div className="loading">Loading your profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="main-content">
        <div className="container">
          <div className="profile-header">
            <h1>{`Hi, ${user.firstName}`}</h1>
            {!editing && (
              <button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {(formData?.firstName || 'U').charAt(0).toUpperCase()}
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-input"
                      value={formData?.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-input"
                      value={formData?.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      value={formData?.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      className="form-input"
                      rows="4"
                      placeholder="Tell us about yourself..."
                      value={formData?.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-section">
                    <h2>{formData.firstName || formData.lastName
                      ? `${formData.firstName} ${formData.lastName}`.trim()
                      : formData.username || 'No Name'
                    }</h2>
                    <p className="email">{formData.email}</p>
                  </div>

                  {formData.bio && (
                    <div className="info-section">
                      <h3>Bio</h3>
                      <p className="bio">{formData.bio}</p>
                    </div>
                  )}

                  <div className="info-section">
                    <h3>Account Info</h3>
                    <div className="info-grid">
                      <div>
                        <strong>Member Since:</strong>
                        <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                      <div>
                        <strong>Last Updated:</strong>
                        <span>{profile.modifiedAt ? new Date(profile.modifiedAt).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="change-password-section">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowChangePassword(!showChangePassword)}
                    >
                      {showChangePassword ? 'Cancel' : 'Change Password'}
                    </button>

                    {showChangePassword && (
                      <form className="change-password-form" onSubmit={handlePasswordChange}>
                        <div className="form-group">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-input"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-input"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-input"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn btn-success">
                            Update Password
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;