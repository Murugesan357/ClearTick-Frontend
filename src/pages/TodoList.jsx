import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../utils/api';
import Header from '../components/Header';
import '../styles/TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTodo, setNewTodo] = useState({ title: '', description: '', dueDate: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortOption, setSortOption] = useState('createdAt');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTodos();
  }, [sortOption]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos(user?.id, sortOption);
      setTodos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      await createTodo(
        newTodo.title,
        newTodo.description,
        user.id,
        newTodo.dueDate || new Date().toISOString().split('T')[0]
      );
      fetchTodos();
      setNewTodo({ title: '', description: '', dueDate: '' });
      setShowAddForm(false);
      setSuccess('Todo added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleStartEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      dueDate: (todo.dueDate || todo.due_date || '').split('T')[0],
    });
  };

  const handleUpdateTodo = async (id) => {
    try {
      await updateTodo(id, editForm);
      fetchTodos();
      setEditingTodo(null);
      setEditForm({ title: '', description: '', dueDate: '' });
      setSuccess('Todo updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await deleteTodo(id);
      fetchTodos();
      setSuccess('Todo deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleComplete = async (todo) => {
    await updateTodo(todo.id, { isCompleted: !todo.isCompleted });
    fetchTodos();
  };

  // Determine status class for dot color
  const getStatusClass = (todo) => {
    if (todo.isCompleted) return 'completed';
    const dueDate = new Date(todo.dueDate || todo.due_date);
    const today = new Date();
    const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'overdue';
    if (diff <= 2) return 'due-soon';
    return 'due-later';
  };


  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="loading">Loading your todos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="main-content">
        <div className="todos-header">
          <h1>{`Hello, ${user?.firstName ?? 'user'}`}</h1>
          <div className="header-right">
            <div className="sort-container">
              <label className="sort-label" htmlFor="sort">Sort By:</label>
              <select
                id="sort"
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="createdAt">Created At</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Todo'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showAddForm && (
          <div className="todo-form">
            <h3>Add New Todo</h3>
            <form onSubmit={handleAddTodo}>
              <input
                type="text"
                className="form-input"
                placeholder="Todo title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                required
              />
              <textarea
                className="form-input"
                placeholder="Description (optional)"
                rows="3"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
              <input
                type="date"
                className="form-input"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-success">Add Todo</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="todos-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <h3>No todos yet!</h3>
              <p>Click "Add Todo" to create your first task.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className={`todo-card ${getStatusClass(todo)}`}>
                {editingTodo === todo.id ? (
                  <div className={`edit-form ${getStatusClass(todo)}`}>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                    <textarea
                      className="form-input"
                      rows="3"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <input
                      type="date"
                      className="form-input"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <div className="form-actions">
                      <button className="btn btn-success" onClick={() => handleUpdateTodo(todo.id)}>Save</button>
                      <button className="btn btn-secondary" onClick={() => setEditingTodo(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <h3 className="todo-title">{todo.title}</h3>
                      {todo.description && <p className="todo-description">{todo.description}</p>}
                      {(todo.dueDate || todo.due_date) && (
                        <p className="todo-due-date">
                          Due: {new Date(todo.dueDate || todo.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="todo-actions">
                      <button
                        className={`btn ${todo.isCompleted ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => handleToggleComplete(todo)}
                      >
                        {todo.isCompleted ? 'Undo' : 'Complete'}
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleStartEditing(todo)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))

          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
