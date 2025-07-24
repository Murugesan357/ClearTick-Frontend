const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to make API calls
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
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
  return apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signupUser = async (firstName, lastName, email, password) => {
  console.log(firstName, lastName, email, password)
  return apiCall('/users/signup', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
};

// Todo API calls
export const getTodos = async (userId) => {
  return apiCall(`/todos/user?userId=${userId}`,{},true);
};

export const createTodo = async (title, description = '', userId) => {
  return apiCall('/todos', {
    method: 'POST',
    body: JSON.stringify({ title, description, userId }),
  }, true);
};

export const updateTodo = async (id, updates) => {
  return apiCall(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  },true);
};

export const deleteTodo = async (id) => {
  return apiCall(`/todos/${id}`, {
    method: 'DELETE',
  },true);
};

// Profile API calls
export const getProfile = async (id) => {
  return apiCall(`/users/${id}`, {}, true);
};

export const updateProfile = async (updates, id) => {
  return apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, true);
};