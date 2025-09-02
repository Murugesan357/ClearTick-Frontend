const rawApiUrl = import.meta.env.VITE_API_URL || "https://clearlist-server.onrender.com";

export const API_BASE_URL = rawApiUrl;

export const apiCall = async (endpoint, options = {}, isAuthenticate) => {
  const authtoken = localStorage.getItem('authtoken');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(isAuthenticate && { 'Authorization': authtoken }),
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

// Auth API calls
export const loginUser = async (email, password) => {
  return apiCall('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signupUser = async (firstName, lastName, email, password) => {
  console.log(firstName, lastName, email, password)
  return apiCall('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
};

// Todo API calls
export const getTodos = async (userId, sortBy) => {
  return apiCall(`/api/todos/user?userId=${userId}&sortBy=${sortBy}`,{},true);
};

export const createTodo = async (title, description = '', userId, dueDate) => {
  return apiCall('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ title, description, userId, dueDate }),
  }, true);
};

export const updateTodo = async (id, updates) => {
  return apiCall(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  },true);
};

export const deleteTodo = async (id) => {
  return apiCall(`/api/todos/${id}`, {
    method: 'DELETE',
  },true);
};

// Profile API calls
export const getProfile = async (id) => {
  return apiCall(`/api/users/${id}`, {}, true);
};

export const updateProfile = async (updates, id) => {
  return apiCall(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, true);
};

export const sendMail = async (email)=>{
  return apiCall('/api/users/sendmail',{
    method: 'POST',
    body: JSON.stringify({email}),
  });
}

export const verifyOtp = async (data)=>{
  return apiCall('/api/users/verifyotp',{
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export const updatePassword = async (email, currentPassword, newPassword)=>{
  return apiCall('/api/users/forgotpassword',{
    method: 'POST',
    body: JSON.stringify({email, currentPassword, newPassword}),
  });
}